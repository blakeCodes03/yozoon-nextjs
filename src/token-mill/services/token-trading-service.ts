import { PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { connectionService } from './connection-service';

/**
 * TokenTradingService handles user token buy/sell operations
 */
export class TokenTradingService {
  private static instance: TokenTradingService;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): TokenTradingService {
    if (!TokenTradingService.instance) {
      TokenTradingService.instance = new TokenTradingService();
    }
    return TokenTradingService.instance;
  }

  /**
   * Buy user tokens with SOL
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address
   * @param amountSol - Amount of SOL to spend (in lamports)
   * @returns Transaction signature
   */
  public async buyUserTokens(
    mint: string | PublicKey,
    authority: string | PublicKey,
    amountSol: number
  ): Promise<string> {
    // Convert strings to PublicKey if needed
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    const authorityPubkey = typeof authority === 'string' ? new PublicKey(authority) : authority;
    
    // Get program and provider
    const program = connectionService.getProgram();
    const provider = connectionService.getProvider();
    const buyerPubkey = provider.wallet.publicKey;
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Get AI Agent Token PDA (3 seeds with authority)
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      authorityPubkey,
      mintPubkey
    );
    
    // Get buyer's token account
    const buyerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      buyerPubkey
    );
    
    // Get buyer's user state PDA
    const buyerUserStatePda = connectionService.getUserStatePda(buyerPubkey);
    
    // Get config account to find platform treasury
    const config = await program.account.config.fetch(configPda);
    
    // Convert SOL amount to lamports
    const solAmount = new BN(amountSol);
    
    // Check if the user has a referrer set
    let referrer: PublicKey | null = null;
    try {
      const userState = await program.account.userState.fetch(buyerUserStatePda);
      if (userState.referrer) {
        referrer = userState.referrer;
        console.log(`Using referrer: ${referrer.toString()}`);
      }
    } catch (error) {
      console.log('No user state found, proceeding without referrer');
    }
    
    // Execute buyUserTokens instruction
    if (referrer) {
      // With referrer
      return await program.methods
        .buyUserTokens(solAmount)
        .accounts({
          config: configPda,
          aiAgentToken: aiAgentTokenPda,
          mint: mintPubkey,
          buyerTokenAccount,
          tokenTreasury: authorityPubkey,
          platformTreasury: config.treasury,
          buyer: buyerPubkey,
          buyerUserState: buyerUserStatePda,
          referrer,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ commitment: 'confirmed' });
    } else {
      // Without referrer
      return await program.methods
        .buyUserTokens(solAmount)
        .accounts({
          config: configPda,
          aiAgentToken: aiAgentTokenPda,
          mint: mintPubkey,
          buyerTokenAccount,
          tokenTreasury: authorityPubkey,
          platformTreasury: config.treasury,
          buyer: buyerPubkey,
          buyerUserState: buyerUserStatePda,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ commitment: 'confirmed' });
    }
  }

  /**
   * Sell user tokens to receive SOL
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address 
   * @param tokenAmount - Amount of tokens to sell (in smallest units)
   * @returns Transaction signature
   */
  public async sellUserTokens(
    mint: string | PublicKey,
    authority: string | PublicKey,
    tokenAmount: number
  ): Promise<string> {
    // Convert strings to PublicKey if needed
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    const authorityPubkey = typeof authority === 'string' ? new PublicKey(authority) : authority;
    
    // Get program and provider
    const program = connectionService.getProgram();
    const provider = connectionService.getProvider();
    const sellerPubkey = provider.wallet.publicKey;
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Get AI Agent Token PDA (3 seeds with authority)
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      authorityPubkey,
      mintPubkey
    );
    
    // Get seller's token account
    const sellerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      sellerPubkey
    );
    
    // Convert token amount to BN
    const tokenAmountBN = new BN(tokenAmount);
    
    // Execute sellUserTokens instruction
    return await program.methods
      .sellUserTokens(tokenAmountBN)
      .accounts({
        config: configPda,
        aiAgentToken: aiAgentTokenPda,
        mint: mintPubkey,
        sellerTokenAccount,
        tokenTreasury: authorityPubkey,
        seller: sellerPubkey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' });
  }

  /**
   * Buy YOZOON tokens with SOL
   * 
   * @param amountSol - Amount of SOL to spend (in lamports)
   * @returns Transaction signature
   */
  public async buyYozoonTokens(amountSol: number): Promise<string> {
    // Get program and provider
    const program = connectionService.getProgram();
    const provider = connectionService.getProvider();
    const buyerPubkey = provider.wallet.publicKey;
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Get bonding curve PDA
    const bondingCurvePda = connectionService.getBondingCurvePda();
    
    // Fetch config to get YOZOON mint
    const config = await program.account.config.fetch(configPda);
    const yozoonMint = config.mint;
    
    // Get buyer's token account
    const buyerTokenAccount = await getAssociatedTokenAddress(
      yozoonMint,
      buyerPubkey
    );
    
    // Get buyer's user state PDA
    const buyerUserStatePda = connectionService.getUserStatePda(buyerPubkey);
    
    // Convert SOL amount to lamports
    const solAmount = new BN(amountSol);
    
    // Check if the user has a referrer set
    let referrer: PublicKey | null = null;
    try {
      const userState = await program.account.userState.fetch(buyerUserStatePda);
      if (userState.referrer) {
        referrer = userState.referrer;
        console.log(`Using referrer: ${referrer.toString()}`);
      }
    } catch (error) {
      console.log('No user state found, proceeding without referrer');
    }
    
    // Execute buyTokens instruction
    if (referrer) {
      // With referrer
      return await program.methods
        .buyTokens(solAmount)
        .accounts({
          config: configPda,
          bondingCurve: bondingCurvePda,
          mint: yozoonMint,
          buyerTokenAccount,
          treasury: config.treasury,
          buyer: buyerPubkey,
          buyerUserState: buyerUserStatePda,
          referrer,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ commitment: 'confirmed' });
    } else {
      // Without referrer
      return await program.methods
        .buyTokens(solAmount)
        .accounts({
          config: configPda,
          bondingCurve: bondingCurvePda,
          mint: yozoonMint,
          buyerTokenAccount,
          treasury: config.treasury,
          buyer: buyerPubkey,
          buyerUserState: buyerUserStatePda,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ commitment: 'confirmed' });
    }
  }

  /**
   * Sell YOZOON tokens to receive SOL
   * 
   * @param tokenAmount - Amount of tokens to sell (in smallest units)
   * @returns Transaction signature
   */
  public async sellYozoonTokens(tokenAmount: number): Promise<string> {
    // Get program and provider
    const program = connectionService.getProgram();
    const provider = connectionService.getProvider();
    const sellerPubkey = provider.wallet.publicKey;
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Get bonding curve PDA
    const bondingCurvePda = connectionService.getBondingCurvePda();
    
    // Fetch config to get YOZOON mint
    const config = await program.account.config.fetch(configPda);
    const yozoonMint = config.mint;
    
    // Get seller's token account
    const sellerTokenAccount = await getAssociatedTokenAddress(
      yozoonMint,
      sellerPubkey
    );
    
    // Convert token amount to BN
    const tokenAmountBN = new BN(tokenAmount);
    
    // Execute sellTokens instruction
    return await program.methods
      .sellTokens(tokenAmountBN)
      .accounts({
        config: configPda,
        bondingCurve: bondingCurvePda,
        mint: yozoonMint,
        sellerTokenAccount,
        treasury: config.treasury,
        seller: sellerPubkey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' });
  }
}

// Export singleton instance for easy import
export const tokenTradingService = TokenTradingService.getInstance();
