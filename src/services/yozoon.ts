import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } from "@solana/spl-token";
import { connection } from "../lib/connection";

export interface YozoonBalance {
  balance: number;
  usdValue: number;
}

export async function getYozoonBalance(
  wallet: PublicKey,
  yozoonMint: PublicKey
): Promise<YozoonBalance> {
  try {
    // Get the user's associated token account (ATA) for the Yozoon mint
    const ata = await getAssociatedTokenAddress(yozoonMint, wallet);
    console.log("ATA Address:", ata.toBase58());

    let balance = 0;

    try {
      const accountInfo = await getAccount(connection, ata);
      balance = Number(accountInfo.amount);
      console.log("Yozoon balance:", balance);
    } catch (err) {
      if (err instanceof TokenAccountNotFoundError) {
        console.warn("Yozoon ATA not found, defaulting balance to 0");
        balance = 0;
      } else {
        throw err; // bubble up other unexpected errors
      }
    }

    const usdValue = 0; // Placeholder until you add a price feed
    return { balance, usdValue };
  } catch (err) {
    console.error("Failed to fetch Yozoon balance:", err);
    throw new Error("Unable to fetch Yozoon balance");
  }
}
