import { PublicKey } from "@solana/web3.js";



if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
    throw new Error("NEXT_PUBLIC_PROGRAM_ID is not defined in the environment");
}

if (!process.env.NEXT_PUBLIC_CONFIG_SEED) {
    throw new Error("NEXT_PUBLIC_CONFIG_SEED is not defined in the environment");
}

if (!process.env.NEXT_PUBLIC_BONDING_CURVE_SEED) {
    throw new Error("NEXT_PUBLIC_BONDING_CURVE_SEED is not defined in the environment");
  }

const CONFIG_SEED = process.env.NEXT_PUBLIC_CONFIG_SEED;
const BONDING_CURVE_SEED = process.env.NEXT_PUBLIC_BONDING_CURVE_SEED;

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);

export async function getConfigPDA() {
    const [configPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(CONFIG_SEED)],
        PROGRAM_ID
    );

    console.log("Config PDA address:", configPDA.toBase58());
    console.log("Bump:", bump);

    return { configPDA, bump };
}

export async function getBondingCurvePDA() {
    const [bondingCurvePDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(BONDING_CURVE_SEED)],
        PROGRAM_ID
    );

    console.log("Bonding Curve PDA address:", bondingCurvePDA.toBase58());
    console.log("Bump:", bump);

    return { bondingCurvePDA, bump };
}

export async function getReflectionStatePDA(yozoonMint: PublicKey) {
    const [reflectionStatePDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from('reflection_state'), yozoonMint.toBuffer()],
        PROGRAM_ID
    );

    console.log("Reflection State PDA address:", reflectionStatePDA.toBase58());
    console.log("Bump:", bump);

    return { reflectionStatePDA, bump };
}




