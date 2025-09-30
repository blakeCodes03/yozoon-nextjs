import { Connection } from "@solana/web3.js";



const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

if (!RPC_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_RPC_ENDPOINT is not defined in the environment");
}

// Create a shared Solana connection for your dApp
export const connection = new Connection(RPC_ENDPOINT, "confirmed");
