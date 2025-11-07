// Correct imports
import { PublicKey, Connection } from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    getAccount,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { getConfigPDA } from "../../../utils/config";
import { useProgramUser } from "@/hooks/useProgram";
import { Program } from "@coral-xyz/anchor";
import {connection} from "@/lib/connection";




export async function getUserTokenBalance(
    program: Program,
    userWallet: PublicKey
) {

    const { configPDA } = await getConfigPDA();
    const configAccount = await (program.account as any).config.fetch(configPDA);

    const yozoonMint = configAccount.mint;

    const userTokenAccount = await getAssociatedTokenAddress(yozoonMint, userWallet);

    try {
        const accountInfo = await getAccount(connection, userTokenAccount);

        // Get amount and decimals
        const rawAmount = Number(accountInfo.amount);
        const decimals = 9;

        const balance = rawAmount / 10 ** decimals;
        console.log(`Token balance: ${balance}`);
        return balance;
    } catch (err) {
        console.log("Token account does not exist, balance = 0");
        return 0;
    }
}
