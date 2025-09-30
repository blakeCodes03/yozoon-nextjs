import { Program, BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";



export const getUserTokenPrice = async (
    program: Program,
    aiAgentTokenPDA: PublicKey,
    userTokenMint: PublicKey
): Promise<BN> => {
    const price: BN = await program.methods
        .getUserTokenPrice()
        .accounts({
            aiAgentToken: aiAgentTokenPDA,
            mint: userTokenMint,
        })
        .view(); // .view() is used for read-only RPC calls



    const userTokenPrice = price / LAMPORTS_PER_SOL;

    console.log("User Token Price:", userTokenPrice);

    return userTokenPrice;
}
