import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { connectionService } from './connection-service';

/**
 * ReferralService handles the referral system functionality
 */
export class ReferralService {
  private static instance: ReferralService;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  /**
   * Set a referrer for the current user
   * Note: This can only be done once per user and cannot be changed later
   * 
   * @param referrerAddress - The public key of the referrer
   * @returns Transaction signature
   */
  public async setReferrer(referrerAddress: string | PublicKey): Promise<string> {
    // Convert string to PublicKey if needed
    const referrerPubkey = typeof referrerAddress === 'string' ? 
      new PublicKey(referrerAddress) : referrerAddress;
    
    // Get program and provider
    const program = connectionService.getProgram();
    const provider = connectionService.getProvider();
    const userPubkey = provider.wallet.publicKey;
    
    // Get user state PDA
    const userStatePda = connectionService.getUserStatePda(userPubkey);
    
    // Prevent setting self as referrer
    if (userPubkey.equals(referrerPubkey)) {
      throw new Error('Cannot set yourself as your own referrer');
    }
    
    // Execute setUserReferrer instruction
    return await program.methods
      .setUserReferrer(referrerPubkey)
      .accounts({
        user: userPubkey,
        userState: userStatePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: 'confirmed' });
  }

  /**
   * Check if the current user has a referrer set
   * 
   * @returns Information about the user's referrer or null if none is set
   */
  public async getUserReferrer(): Promise<{
    referrer: PublicKey;
    createdAt: BN;
  } | null> {
    try {
      // Get program and provider
      const program = connectionService.getProgram();
      const provider = connectionService.getProvider();
      const userPubkey = provider.wallet.publicKey;
      
      // Get user state PDA
      const userStatePda = connectionService.getUserStatePda(userPubkey);
      
      // Fetch user state
      const userState = await program.account.userState.fetch(userStatePda);
      
      if (userState.referrer) {
        return {
          referrer: userState.referrer,
          createdAt: userState.createdAt
        };
      }
      
      return null;
    } catch (error) {
      // User state doesn't exist yet or cannot be fetched
      return null;
    }
  }

  /**
   * Get all users that have set the specified address as their referrer
   * 
   * @param referrerAddress - The referrer's public key
   * @returns Array of user public keys that have this referrer
   */
  public async getReferredUsers(referrerAddress: string | PublicKey): Promise<PublicKey[]> {
    // Convert string to PublicKey if needed
    const referrerPubkey = typeof referrerAddress === 'string' ? 
      new PublicKey(referrerAddress) : referrerAddress;
    
    // Get program
    const program = connectionService.getProgram();
    
    // Get all UserState accounts
    const allUserStates = await program.account.userState.all();
    
    // Filter user states that have this referrer
    const referredUsers = allUserStates
      .filter(userState => 
        userState.account.referrer && 
        userState.account.referrer.equals(referrerPubkey)
      )
      .map(userState => userState.account.user);
    
    return referredUsers;
  }
}

// Export singleton instance for easy import
export const referralService = ReferralService.getInstance();
