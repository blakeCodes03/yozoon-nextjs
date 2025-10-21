import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useMemo } from "react";
import { connection } from "../lib/connection";
import idl from "../services/token-mill/idl/yozoon.json"; // your program’s IDL
import type { Yozoon } from "../services/token-mill/types/yozoon"; // generated types
import { Keypair, Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export function useProgramUser (wallet: any, connected?: boolean) {
  return useMemo(() => {
    if (!connected || !wallet?.publicKey) return null;

    let anchorWallet = wallet;

    // Wrap raw Keypair in NodeWallet if needed
    if (wallet.secretKey) {
      const { NodeWallet } = require("@coral-xyz/anchor");
      anchorWallet = new NodeWallet(wallet);
    }

    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });

    return new Program(idl as unknown as Yozoon, provider);
  }, [wallet?.publicKey?.toBase58(), connected]); // 👈 dependency on publicKey
}




export function useProgramAdmin(wallet: any) {
  return useMemo(() => {
    if (!wallet?.publicKey) return null;

    // Wrap Keypair in NodeWallet if needed
    let anchorWallet = wallet;
    if (wallet.secretKey) {
      // it's a Keypair
      const { NodeWallet } = require("@coral-xyz/anchor");
      anchorWallet = new NodeWallet(wallet);
    }

    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });

    return new Program(idl as unknown as Yozoon, provider);
  }, [wallet]);
}

const dummyWallet = {
  publicKey: Keypair.generate().publicKey,
};

export function useProgramReadonly() {
  return useMemo(() => {
    const provider = new AnchorProvider(connection, dummyWallet as any, {
      preflightCommitment: "processed",
    });

    return new Program(idl as unknown as Yozoon, provider);
  }, []);
}