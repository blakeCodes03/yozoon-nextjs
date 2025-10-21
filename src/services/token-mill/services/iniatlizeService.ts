import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import {getConfigPDA} from "../../../utils/config";
import { KeypairWallet } from "../../../utils/KeypairWallet"; // custom wallet adapter
import * as anchor from '@coral-xyz/anchor';

if (!process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
    throw new Error("ADMIN_SECRET_KEY is not defined in the environment");
}

const secretKey = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY);

const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

export const wallet = new KeypairWallet(keypair);





export async function initializeConfig(program: any, wallet: { publicKey: PublicKey; signTransaction: Function; signAllTransactions: Function }): Promise<PublicKey> {
  try {


    if (!program) throw new Error("Program not loaded");

    const { configPDA, bump } = await getConfigPDA();

     const mintKeypair = Keypair.generate();

    const [reflectionStatePDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("reflection_state"), mintKeypair.publicKey.toBuffer()],
      program.programId
    );
    console.log("Reflection State PDA:", reflectionStatePDA.toBase58());
    // Create a new mint
   

    const txSig = await program.methods
      .initializeMint()
      .accounts({
        config: configPDA,
        mint: mintKeypair.publicKey,
        reflectionState: reflectionStatePDA,
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("✅ Config initialized:", txSig);

    console.log("Config public key:", mintKeypair.publicKey.toBase58());

    return mintKeypair.publicKey; // return for frontend use
  } catch (err) {
    console.error("❌ Failed to initialize config:", err);
    throw err; // optionally re-throw if you want upstream handling
  }
}


export async function InitializeBondingCurve(
  program: any,
  wallet: { publicKey: PublicKey; signTransaction: Function; signAllTransactions: Function }
): Promise<PublicKey> {
  try {
    if (!program) throw new Error("Program not loaded");

    const [bondingCurvePDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve")],
      program.programId
    );

    const pricePoints = [new anchor.BN(100000)];

    const txSig = await program.methods
      .initializeBondingCurve(pricePoints)   // ✅ pass Vec<u64>
      .accounts({
        bonding_curve: bondingCurvePDA,      // ✅ must match Rust field name
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Bonding curve initialized:", txSig);
    console.log("Bonding curve PDA:", bondingCurvePDA.toBase58());

    return bondingCurvePDA; // ✅ return PDA (the account address), not a random mint
  } catch (err) {
    console.error("❌ Failed to initialize bonding curve:", err);
    throw err;
  }
}
