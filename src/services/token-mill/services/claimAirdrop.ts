import { Transaction, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token';
import { getConfigPDA, PROGRAM_ID } from '@/utils/config';
import { connection } from '@/lib/connection';

/**
 * Claim a simple airdrop for the connected wallet.
 *
 * Parameters:
 * - program: Anchor Program instance (user provider)
 * - walletPubkey: PublicKey of the connected wallet (signer)
 * - opts.airdropAccount?: optional airdrop PDA. If omitted the airdrop PDA will be derived as ["airdrop", walletPubkey]
 * - opts.tokenMint: PublicKey of the token mint for this airdrop
 *
 * Returns transaction signature string on success.
 */
export async function claimAirdrop(
  program: Program,
  walletPubkey: PublicKey,
  opts: { airdropAccount?: PublicKey; tokenMint: PublicKey }
) {
  if (!program) throw new Error('Program is required');
  if (!walletPubkey) throw new Error('walletPubkey is required');
  if (!opts?.tokenMint) throw new Error('tokenMint is required');

  const { configPDA } = await getConfigPDA();

  // fetch config to obtain treasury, mint info etc.
  const configAccount = await (program.account as any).config.fetch(configPDA);

  // Derive or use provided airdrop PDA
  let airdropPDA = opts.airdropAccount;
  if (!airdropPDA) {
    [airdropPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('airdrop'), walletPubkey.toBuffer()],
      PROGRAM_ID
    );
  }

  // airdrop ledger PDA (seed: "airdrop_ledger")
  const [airdropLedgerPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('airdrop_ledger')],
    PROGRAM_ID
  );

  const recipientTokenAccount = await getAssociatedTokenAddress(
    opts.tokenMint,
    walletPubkey
  );

  const instructions: anchor.web3.TransactionInstruction[] = [];

  // Ensure recipient ATA exists (create if missing)
  try {
    await getAccount(connection, recipientTokenAccount);
  } catch (err) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        walletPubkey, // payer
        recipientTokenAccount,
        walletPubkey, // owner
        opts.tokenMint
      )
    );
  }

  // Build claim instruction from IDL
  const claimIx = await program.methods
    .claimAirdrop()
    .accounts({
      config: configPDA,
      airdrop: airdropPDA,
      recipient: walletPubkey,
      recipientTokenAccount,
      tokenMint: opts.tokenMint,
      airdropLedger: airdropLedgerPDA,
      treasury: configAccount.treasury,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  instructions.push(claimIx);

  // Finalize transaction
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const tx = new Transaction({
    feePayer: walletPubkey,
    recentBlockhash: blockhash,
  }).add(...instructions);

  const provider = program.provider as anchor.AnchorProvider;

  const txSig = await provider.sendAndConfirm(tx, [], {
    commitment: 'confirmed',
    preflightCommitment: 'processed',
  });

  return txSig;
}