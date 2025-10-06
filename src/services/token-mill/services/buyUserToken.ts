import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { connection } from "../../../lib/connection";
import * as anchor from "@coral-xyz/anchor";

interface BuyUserTokensParams {
  program: Program;
  userTokenMint: PublicKey;
  solAmount: number; // in lamports
  configPDA: PublicKey;
  aiAgentTokenPDA: PublicKey;
  buyer: PublicKey;
  buyerUserStatePDA: PublicKey;
  platformTreasury: PublicKey;
  referrerAccount?: PublicKey;
}

export async function buyUserTokens({
  program,
  userTokenMint,
  solAmount,
  configPDA,
  aiAgentTokenPDA,
  buyer,
  buyerUserStatePDA,
  platformTreasury,
  referrerAccount,
}: BuyUserTokensParams) {
  try {
    const instructions: any[] = [];

    // 1️⃣ Derive buyer ATA
    const buyerTokenAccount = await getAssociatedTokenAddress(userTokenMint, buyer);

    // Ensure ATA exists
    try {
      await getAccount(connection, buyerTokenAccount);
      console.log("Buyer ATA exists:", buyerTokenAccount.toBase58());
    } catch {
      console.log("Buyer ATA does not exist, creating...");
      instructions.push(
        createAssociatedTokenAccountInstruction(
          buyer,
          buyerTokenAccount,
          buyer,
          userTokenMint
        )
      );
    }

    // 2️⃣ Fetch config → Yozoon mint
    const configAccount = await (program.account as any).config.fetch(configPDA);
    const yozoonMint = configAccount.mint;

    // 3️⃣ Derive PDAs
    const [tokenTreasury] = await PublicKey.findProgramAddress(
      [Buffer.from("user_token_treasury"), userTokenMint.toBuffer()],
      program.programId
    );

    const [userStatePDA] = await PublicKey.findProgramAddress(
      [Buffer.from("user_state"), buyer.toBuffer()],
      program.programId
    );

    const [reflectionStatePDA] = await PublicKey.findProgramAddress(
      [Buffer.from("reflection_state"), yozoonMint.toBuffer()],
      program.programId
    );

    const [reflectionVaultPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("reflection_treasury"), yozoonMint.toBuffer()],
      program.programId
    );

    // 4️⃣ Initialize user state if not exists
    const accountInfo = await connection.getAccountInfo(userStatePDA);
    if (!accountInfo) {
      const initUserStateIx = await program.methods
        .initializeUserState()
        .accounts({
          user: buyer,
          userState: buyerUserStatePDA,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      instructions.push(initUserStateIx);
      console.log("Queued initializeUserState instruction");
    }

    // 5️⃣ Fetch existing referrer
    let existingReferrer: PublicKey | null = null;
    try {
      const userStateAccount = await (program.account as any)["userState"].fetchNullable(
        buyerUserStatePDA
      );
      if (userStateAccount && !userStateAccount.referrer.equals(PublicKey.default)) {
        existingReferrer = userStateAccount.referrer;
      }
    } catch (e) {
      console.warn("UserState not found, treating as no referrer");
    }

    // 6️⃣ Set referrer if needed
    if (referrerAccount && !existingReferrer) {
      const setReferrerIx = await program.methods
        .setUserReferrer(referrerAccount)
        .accounts({
          userState: buyerUserStatePDA,
          user: buyer,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      instructions.push(setReferrerIx);
      console.log("Queued setUserReferrer for:", referrerAccount.toBase58());
    }

    // 7️⃣ Build accounts for buyUserTokens
    const buyAccounts: any = {
      config: configPDA,
      aiAgentToken: aiAgentTokenPDA,
      mint: userTokenMint,
      buyerTokenAccount,
      tokenTreasury,
      platformTreasury,
      yozoonMint,
      reflectionState: reflectionStatePDA,
      reflectionTreasury: reflectionVaultPDA,
      buyer,
      referrer: !existingReferrer && referrerAccount ? referrerAccount : null,
      buyerUserState: buyerUserStatePDA,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    const buyIx = await program.methods
      .buyUserTokens(new BN(solAmount))
      .accounts(buyAccounts)
      .instruction();
    instructions.push(buyIx);

    // 8️⃣ Send single transaction
    const tx = new Transaction().add(...instructions);
    const provider = program.provider as anchor.AnchorProvider;
    const txSig = await provider.sendAndConfirm(tx);

    console.log("✅ Transaction sent:", txSig);
    return txSig;
  } catch (err: any) {
    console.error("❌ Transaction failed:", err);
    if (err.logs) {
      console.group("Program Logs");
      err.logs.forEach((log: string) => console.log(log));
      console.groupEnd();
    }
    throw err;
  }
}
