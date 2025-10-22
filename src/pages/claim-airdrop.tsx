import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgramUser } from '@/hooks/useProgram';
import { PublicKey } from '@solana/web3.js';
import { claimAirdrop } from '@/services/token-mill/services/claimAirdrop';
import styles from '@/styles/claim-airdrop.module.css';

export default function ClaimAirdropPage() {
  const { publicKey, wallet, connected } = useWallet();
  const program = useProgramUser(wallet, connected);

  const [mintInput, setMintInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setError(null);
    setTxSig(null);
    if (!program)
      return setError('Program not available, connect wallet first.');
    if (!publicKey) return setError('Connect your wallet.');

    let mint: PublicKey;
    try {
      mint = new PublicKey(mintInput.trim());
    } catch (err) {
      return setError('Invalid mint address');
    }

    setLoading(true);
    try {
      const sig = await claimAirdrop(program, publicKey, { tokenMint: mint });
      setTxSig(sig);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Claim failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Claim Airdrop</h1>

      <div className={styles.field}>
        <label>Token Mint</label>
        <input
          value={mintInput}
          onChange={(e) => setMintInput(e.target.value)}
          placeholder="Enter token mint address"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <button
          className={styles.button}
          onClick={handleClaim}
          disabled={loading || !connected}
        >
          {loading ? 'Claiming...' : 'Claim Airdrop'}
        </button>
      </div>

      {txSig && (
        <div className={styles.result}>
          <strong>Transaction:</strong>
          <div>{txSig}</div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}
