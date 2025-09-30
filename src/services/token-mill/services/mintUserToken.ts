import { Transaction, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { getConfigPDA } from "../../../utils/config";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey as Web3PublicKey } from "@solana/web3.js";

interface CreateUserTokenOptions {
  program: Program;
  publicKey: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  image: string;
  totalSupply: anchor.BN;
  initialPrice: anchor.BN;
  kFactor: anchor.BN;
}



export async function createUserToken(options: CreateUserTokenOptions): Promise<PublicKey> {
  const { program, publicKey, name, symbol, uri, image, totalSupply, initialPrice, kFactor } = options;

  const wallet = program.provider.wallet as any;
  const connection = program.provider.connection;

  const { configPDA } = await getConfigPDA();
  const configAccount = await (program.account as any).config.fetch(configPDA);

  const [userStatePDA] = await PublicKey.findProgramAddress(
    [Buffer.from("user_state"), publicKey.toBuffer()],
    program.programId
  );

  const yozoonMint = configAccount.mint;
  const creatorYozoonAccount = await getAssociatedTokenAddress(yozoonMint, publicKey);
  const treasury = configAccount.treasury;

  // Generate mint keypair
  const mintKeypair = Keypair.generate();

  const [aiAgentTokenPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("ai_agent_token"), publicKey.toBuffer(), mintKeypair.publicKey.toBuffer()],
    program.programId
  );

  const metadataProgramId = new Web3PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

  // Derive Metadata PDA
  const [metadataPda] = Web3PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      metadataProgramId.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    metadataProgramId
  );

  const airdropAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    aiAgentTokenPDA,
    true
  );

  const creatorTokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    publicKey
  );

  const [reflectionStatePDA] = await PublicKey.findProgramAddress(
    [Buffer.from('reflection_state'), yozoonMint.toBuffer()],
    program.programId
  );

  const [reflectionVaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('reflection_treasury'), yozoonMint.toBuffer()],
    program.programId
  );

  console.log("reflectionStatePDA:", reflectionStatePDA.toBase58());
  console.log("reflectionVaultPDA:", reflectionVaultPDA.toBase58());

  const [tokenTreasuryPDA] = await PublicKey.findProgramAddressSync(
    [Buffer.from('user_token_treasury'), mintKeypair.publicKey.toBuffer()],
    program.programId
  );

  const info = await connection.getAccountInfo(new PublicKey("8HBYrdkivwJ1i73v2omFqVkuM79m2G2jSPKc4qshZ4fc"));
  console.log("Account already exists:", !!info);

  

  const tx = new anchor.web3.Transaction();

  // Step 1: createUserTokenBase
  const existingUserState = await program.account["userState"].fetchNullable(userStatePDA);
  if (!existingUserState) {
    const createBaseIx = await program.methods
      .createUserTokenBase(name, symbol, totalSupply)
      .accounts({
        config: configPDA,
        creator: publicKey,
        userState: userStatePDA,
        creatorYozoonAccount,
        treasury,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();
    tx.add(createBaseIx);
  }

  // Step 2: createUserTokenMint
  let creatorTokenExists = true;
  try {
    await getAccount(connection, creatorTokenAccount);
  } catch (err) {
    creatorTokenExists = false;
  }

  const existingAiAgentToken = await program.account["aiAgentToken"].fetchNullable(aiAgentTokenPDA);

  if (!existingAiAgentToken) {
    const createMintIx = await program.methods
      .createUserTokenMint(name, symbol, uri, image, totalSupply, initialPrice, kFactor)
      .accounts({
        config: configPDA,
        creator: publicKey,
        aiAgentToken: aiAgentTokenPDA,
        mint: mintKeypair.publicKey,
        yozoonMint: yozoonMint,
        metadata: metadataPda,
        airdropAccount,
        creatorTokenAccount,
        reflectionState: reflectionStatePDA,
        reflectionVault: reflectionVaultPDA,
        tokenTreasury: tokenTreasuryPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .instruction();

    tx.add(createMintIx);
  } else {
    console.log("✅ AI Agent Token already exists, skipping creation.");
  }



  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = publicKey;

  // Send transaction
  const txSig = await program.provider.sendAndConfirm(tx, [mintKeypair]);
  console.log("🎉 Mint created:", mintKeypair.publicKey.toBase58(), "tx:", txSig);

  return mintKeypair.publicKey;

}



