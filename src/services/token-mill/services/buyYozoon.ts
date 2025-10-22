import { Transaction, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token';
let MPL_TOKEN_METADATA_PROGRAM_ID: any;
import { PublicKey as Web3PublicKey } from '@solana/web3.js';
try {
  // Attempt to require the metaplex package if available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MPL_TOKEN_METADATA_PROGRAM_ID =
    require('@metaplex-foundation/mpl-token-metadata').MPL_TOKEN_METADATA_PROGRAM_ID;
} catch (e) {
  // Fallback to a default PublicKey when the package isn't available during build
  MPL_TOKEN_METADATA_PROGRAM_ID = Web3PublicKey.default || Web3PublicKey; // best-effort
}
import * as anchor from '@coral-xyz/anchor';

interface BuyTokensParams {
  program: Program;
  wallet: PublicKey;
  configPDA: PublicKey;
  bondingCurvePDA: PublicKey;
  yozoonMint: PublicKey;
  treasury: PublicKey;
  solAmount: number; // lamports
  yozoonName: string;
  yozoonSymbol: string;
  yozoonUri: string;
}

export async function buyYozoon({
  program,
  wallet,
  configPDA,
  bondingCurvePDA,
  yozoonMint,
  treasury,
  solAmount,
  yozoonName,
  yozoonSymbol,
  yozoonUri,
}: BuyTokensParams) {
  const connection = program.provider.connection;

  // ✅ Get buyer ATA
  const buyerTokenAccount = await getAssociatedTokenAddress(yozoonMint, wallet);
  const instructions = [];

  // ✅ Check if ATA exists
  try {
    await getAccount(connection, buyerTokenAccount);
    console.log('Buyer ATA exists:', buyerTokenAccount.toBase58());
  } catch {
    console.log('Buyer ATA does not exist, creating...');
    instructions.push(
      createAssociatedTokenAccountInstruction(
        wallet, // payer
        buyerTokenAccount,
        wallet, // owner
        yozoonMint
      )
    );
  }

  // ✅ Metadata PDA
  const metadataProgramId = new Web3PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
  const [metadataPDA] = Web3PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      metadataProgramId.toBuffer(),
      yozoonMint.toBuffer(),
    ],
    metadataProgramId
  );

  // ✅ Optional: attach SOL transfer if your program requires treasury funding
  instructions.push(
    SystemProgram.transfer({
      fromPubkey: wallet,
      toPubkey: treasury,
      lamports: solAmount,
    })
  );

  // ✅ Buy instruction
  const buyIx = await program.methods
    .buyTokens(
      new BN(solAmount), // amount in lamports
      yozoonName,
      yozoonSymbol,
      yozoonUri
    )
    .accounts({
      config: configPDA,
      bondingCurve: bondingCurvePDA,
      mint: yozoonMint,
      buyer: wallet,
      buyerTokenAccount,
      treasury,
      metadata: metadataPDA,
      tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  instructions.push(buyIx);

  // ✅ Always fetch a fresh blockhash
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const tx = new Transaction({
    feePayer: wallet,
    recentBlockhash: blockhash,
  }).add(...instructions);

  // ✅ Send & confirm
  const provider = program.provider as anchor.AnchorProvider;
  const txSig = await provider.sendAndConfirm(tx, [], {
    commitment: 'confirmed',
    preflightCommitment: 'processed',
    maxRetries: 3,
  });

  console.log('✅ Transaction sent:', txSig);
  return txSig;
}
