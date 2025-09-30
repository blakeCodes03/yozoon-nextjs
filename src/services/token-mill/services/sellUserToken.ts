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



interface SellUserTokensParams {
    program: Program;
    userTokenMint: PublicKey;
    tokenAmount: number; // amount of user tokens to sell (raw units, not lamports)
    configPDA: PublicKey;
    aiAgentTokenPDA: PublicKey;
    seller: PublicKey;
    platformTreasury: PublicKey;

}

export async function sellUserTokens({
    program,
    userTokenMint,
    tokenAmount,
    configPDA,
    aiAgentTokenPDA,
    seller,
    platformTreasury,
}: SellUserTokensParams) {
    try {
        const instructions = [];

        // 1. Derive seller ATA (must exist for selling)
        const sellerTokenAccount = await getAssociatedTokenAddress(userTokenMint, seller);

        try {
            await getAccount(connection, sellerTokenAccount);
            console.log("Seller ATA exists:", sellerTokenAccount.toBase58());
        } catch {
            throw new Error("❌ Seller ATA does not exist — cannot sell without tokens.");
        }

        // 2. Fetch config → Yozoon mint
        const configAccount = await (program.account as any).config.fetch(configPDA);
        const yozoonMint = configAccount.mint;

        // 3. Derive PDAs
        const [tokenTreasuryPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("user_token_treasury"), userTokenMint.toBuffer()],
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

        // 4. (Optional) Set referrer if provided
        const [sellerUserStatePDA] = await PublicKey.findProgramAddress(
            [Buffer.from("user_state"), seller.toBuffer()],
            program.programId
        );

        // 2. Fetch the account
        const userStateAccount = await program.account["userState"].fetch(sellerUserStatePDA);

        // 3. Extract referrer, but return null if not set
        let referrerAccount: PublicKey | null = null;

        if (!userStateAccount.referrer.equals(PublicKey.default)) {
            referrerAccount = userStateAccount.referrer;
        }

        console.log(
            "Seller’s referrer:",
            referrerAccount ? referrerAccount.toBase58() : "❌ none set"
        );

        // 5. Add sellUserTokens instruction
        const sellIx = await program.methods
            .sellUserTokens(new BN(tokenAmount))
            .accounts({
                config: configPDA,
                aiAgentToken: aiAgentTokenPDA,
                mint: userTokenMint,
                sellerTokenAccount,
                seller,
                yozoonMint,
                tokenTreasury: tokenTreasuryPDA,
                reflectionVault: reflectionVaultPDA,
                reflectionState: reflectionStatePDA,
                userState: sellerUserStatePDA,
                referrer: referrerAccount ?? null,
                platformTreasury,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .instruction();

        instructions.push(sellIx);

        // 6. Build & send TX
        const tx = new Transaction().add(...instructions);
        const txSig = await program.provider.sendAndConfirm(tx);

        console.log("✅ Sell TX sent:", txSig);
        return txSig;
    } catch (err: any) {
        console.error("❌ Sell TX failed:", err);
        if (err.logs) {
            console.group("Program Logs");
            err.logs.forEach((log: string) => console.log(log));
            console.groupEnd();
        }
        throw err;
    }
}



