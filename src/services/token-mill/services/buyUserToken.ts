import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { connection } from "../lib/connection";

interface BuyUserTokensParams {
  program: Program;
  userTokenMint: PublicKey;
  solAmount: number; // lamports
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
    const instructions = [];

    // 1. Derive buyer ATA
    const buyerTokenAccount = await getAssociatedTokenAddress(userTokenMint, buyer);

    // Ensure ATA exists
    try {
      await getAccount(connection, buyerTokenAccount);
      console.log("Buyer ATA exists:", buyerTokenAccount.toBase58());
    } catch {
      console.log("Buyer ATA does not exist, creating...");
      instructions.push(
        createAssociatedTokenAccountInstruction(
          buyer, // payer
          buyerTokenAccount, // ATA
          buyer, // owner
          userTokenMint
        )
      );
    }

    // 2. Fetch config → Yozoon mint
    const configAccount = await (program.account as any).config.fetch(configPDA);
    const yozoonMint = configAccount.mint;

    // 3. Derive PDAs
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

    // 4. Initialize user state if not exists
    const accountInfo = await connection.getAccountInfo(userStatePDA);
    if (!accountInfo) {
      const tx = await program.methods
        .initializeUserState()
        .accounts({
          user: buyer,
          userState: userStatePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("User state initialized, tx:", tx);
    }

    // 5. Fetch UserState to check referrer
    let existingReferrer: PublicKey | null = null;
    try {
      const userStateAccount = await program.account["userState"].fetch(buyerUserStatePDA);
      if (!userStateAccount.referrer.equals(PublicKey.default)) {
        existingReferrer = userStateAccount.referrer;
      }
    } catch (e) {
      console.warn("UserState not found, treating as no referrer");
    }

    // 6. Add setUserReferrer instruction only if no referrer is set
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
    } else if (existingReferrer) {
      console.log(`Referrer already set: ${existingReferrer.toBase58()}`);
    } else {
      console.log("No referrer provided");
    }

    // 7. Add buyUserTokens instruction
    const buyIx = await program.methods
      .buyUserTokens(new BN(solAmount))
      .accounts({
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
        buyerUserState: buyerUserStatePDA,
        // 👉 pass null if referrer already set
        referrer: existingReferrer ? null : referrerAccount ?? null,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction();

    instructions.push(buyIx);

    // 8. Build and send transaction
    const tx = new Transaction().add(...instructions);
    const txSig = await program.provider.sendAndConfirm(tx);

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
