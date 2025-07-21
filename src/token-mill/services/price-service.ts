import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { connectionService } from './connection-service';

/**
 * PriceService handles token price calculations
 */
export class PriceService {
  private static instance: PriceService;
  
  // Constants for calculations
  private readonly PRECISION_FACTOR = new BN(1_000_000_000); // 9 decimals

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  /**
   * Get the current price of a user token
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address
   * @returns Token price in SOL
   */
  public async getUserTokenPrice(mint: string | PublicKey, authority: string | PublicKey): Promise<number> {
    // Convert strings to PublicKey if needed
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    const authorityPubkey = typeof authority === 'string' ? new PublicKey(authority) : authority;
    
    // Get program
    const program = connectionService.getProgram();
    
    // Get AI Agent Token PDA (3 seeds with authority)
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      authorityPubkey,
      mintPubkey
    );
    
    // Call the getUserTokenPrice method
    try {
      const price = await program.methods
        .getUserTokenPrice()
        .accounts({
          aiAgentToken: aiAgentTokenPda,
        })
        .view();
      
      // Convert BN price to number (in SOL)
      return price.toNumber() / 1e9;
    } catch (error) {
      console.error('Error getting user token price:', error);
      throw new Error(`Failed to get token price: ${error.message}`);
    }
  }

  /**
   * Calculate the amount of tokens that can be bought with a given SOL amount
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address
   * @param solAmount - Amount of SOL to spend (in lamports)
   * @returns Estimated token amount
   */
  public async estimateUserTokenAmount(mint: string | PublicKey, authority: string | PublicKey, solAmount: number): Promise<number> {
    // Convert strings to PublicKey if needed
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    const authorityPubkey = typeof authority === 'string' ? new PublicKey(authority) : authority;
    
    // Get program
    const program = connectionService.getProgram();
    
    // Get AI Agent Token PDA (3 seeds with authority)
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      authorityPubkey,
      mintPubkey
    );
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Convert SOL amount to BN
    const solAmountBN = new BN(solAmount);
    
    // Call the calculateTokensForUserTokenSol method
    try {
      const tokenAmount = await program.methods
        .calculateTokensForUserTokenSol(solAmountBN)
        .accounts({
          config: configPda,
          aiAgentToken: aiAgentTokenPda,
        })
        .view();
      
      // User tokens have 6 decimals
      return tokenAmount.toNumber() / 1e6;
    } catch (error) {
      console.error('Error estimating user token amount:', error);
      throw new Error(`Failed to estimate token amount: ${error.message}`);
    }
  }

  /**
   * Calculate the SOL amount that would be received by selling a given token amount
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address
   * @param tokenAmount - Amount of tokens to sell (in smallest units)
   * @returns Estimated SOL amount
   */
  public async estimateUserTokenSol(mint: string | PublicKey, authority: string | PublicKey, tokenAmount: number): Promise<number> {
    // Convert strings to PublicKey if needed
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    const authorityPubkey = typeof authority === 'string' ? new PublicKey(authority) : authority;
    
    // Get program
    const program = connectionService.getProgram();
    
    // Get AI Agent Token PDA (3 seeds with authority)
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      authorityPubkey,
      mintPubkey
    );
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Convert token amount to BN
    const tokenAmountBN = new BN(tokenAmount);

  //   const   * 
  //  * @param mint - ToknAmount);
    
    // Call the calculateSolForUserTokens method
    try {
      const solAmount = await program.methods
        .calculateSolForUserTokens(tokenAmountBN)
        .accounts({
          config: configPda,
          aiAgentToken: aiAgentTokenPda,
        })
        .view();
      
      return solAmount.toNumber() / 1e9;
    } catch (error) {
      console.error('Error estimating SOL amount:', error);
      throw new Error(`Failed to estimate SOL amount: ${error.message}`);
    }
  }

  /**
   * Get the current price of YOZOON token
   * 
   * @returns YOZOON token price in SOL
   */
  public async getYozoonTokenPrice(): Promise<number> {
    // Get program
    const program = connectionService.getProgram();
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    // Get bonding curve PDA
    const bondingCurvePda = connectionService.getBondingCurvePda();
    
    // Call the getCurrentPrice method
    try {
      const price = await program.methods
        .getCurrentPrice()
        .accounts({
          config: configPda,
          bondingCurve: bondingCurvePda,
        })
        .view();
      
      // Convert BN price to number (in SOL)
      return price.toNumber() / 1e9;
    } catch (error) {
      console.error('Error getting YOZOON token price:', error);
      throw new Error(`Failed to get YOZOON price: ${error.message}`);
    }
  }
}

// Export singleton instance for easy import
export const priceService = PriceService.getInstance();
