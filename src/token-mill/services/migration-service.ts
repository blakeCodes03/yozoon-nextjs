import { PublicKey } from '@solana/web3.js';
import { connectionService } from './connection-service';

/**
 * MigrationService handles migration-related functionality
 * and detection of the Raydium migration event
 */
export class MigrationService {
  private static instance: MigrationService;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  /**
   * Check if the protocol has migrated to Raydium AMM
   * 
   * @returns Migration status information
   */
  public async checkMigrationStatus(): Promise<{
    migrated: boolean;
    lpMint?: PublicKey;
    nftKey?: PublicKey;
  }> {
    // Get program
    const program = connectionService.getProgram();
    
    // Get config PDA
    const configPda = connectionService.getConfigPda();
    
    try {
      // Fetch config account
      const config = await program.account.config.fetch(configPda);
      
      if (config.migrated) {
        return {
          migrated: true,
          lpMint: config.lpMint,
          nftKey: config.nftKey
        };
      }
      
      return { migrated: false };
    } catch (error) {
      console.error('Error checking migration status:', error);
      throw new Error(`Failed to check migration status: ${error.message}`);
    }
  }

  /**
   * Check if a user token has migrated to Raydium AMM
   * 
   * @param mint - Token mint address
   * @param authority - Token authority address
   * @returns Migration status information
   */
  public async checkUserTokenMigrationStatus(
    mint: string | PublicKey,
    authority: string | PublicKey
  ): Promise<{
    migrated: boolean;
    lpMint?: PublicKey;
    nftKey?: PublicKey;
  }> {
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
    
    try {
      // Fetch AI Agent Token account
      const aiAgentToken = await program.account.aiAgentToken.fetch(aiAgentTokenPda);
      
      if (aiAgentToken.migrated) {
        return {
          migrated: true,
          lpMint: aiAgentToken.lpMint,
          nftKey: aiAgentToken.nftKey
        };
      }
      
      return { migrated: false };
    } catch (error) {
      console.error('Error checking user token migration status:', error);
      throw new Error(`Failed to check user token migration status: ${error.message}`);
    }
  }

  /**
   * Get the estimated time until migration for the main YOZOON token
   * based on current conditions
   * 
   * @returns Estimated time until migration in milliseconds, or null if not determinable
   */
  public async getEstimatedTimeToMigration(): Promise<number | null> {
    try {
      // Get program
      const program = connectionService.getProgram();
      
      // Get config PDA
      const configPda = connectionService.getConfigPda();
      
      // Get bonding curve PDA
      const bondingCurvePda = connectionService.getBondingCurvePda();
      
      // Fetch config and bonding curve accounts
      const config = await program.account.config.fetch(configPda);
      const bondingCurve = await program.account.bondingCurve.fetch(bondingCurvePda);
      
      // If already migrated, return 0
      if (config.migrated) {
        return 0;
      }
      
      // Check if we can estimate based on available data
      if (bondingCurve.totalSupply && bondingCurve.soldSupply && bondingCurve.raisedSol) {
        // Migration happens at either 80% token sale or ~60-63k SOL raised
        const totalSupply = bondingCurve.totalSupply.toNumber();
        const soldSupply = bondingCurve.soldSupply.toNumber();
        const raisedSol = bondingCurve.raisedSol.toNumber();
        
        // SOL migration threshold (~60-63k SOL)
        const solMigrationThreshold = 60_000 * 1e9; // 60k SOL in lamports
        
        // Token sale percentage threshold (80%)
        const tokenSaleThreshold = totalSupply * 0.8;
        
        // Calculate remaining SOL/tokens until migration
        const remainingSol = Math.max(0, solMigrationThreshold - raisedSol);
        const remainingTokens = Math.max(0, tokenSaleThreshold - soldSupply);
        
        // If we have historical data on token sale rate or SOL raise rate,
        // we could estimate time. For now, we'll return null as we don't have that data.
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error estimating time to migration:', error);
      return null;
    }
  }
}

// Export singleton instance for easy import
export const migrationService = MigrationService.getInstance();
