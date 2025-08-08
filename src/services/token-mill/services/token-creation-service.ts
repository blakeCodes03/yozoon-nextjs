// import { PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
// import { BN } from '@coral-xyz/anchor';
// import { Yozoon } from '../idl/yozoon'; // import the TS version of your IDL
// import { Program } from '@coral-xyz/anchor'; // import Program type from Anchor

// // import * as fs from 'fs';
// import { connectionService } from './connection-service';

// /**
//  * TokenCreationService handles the user token creation process
//  */
// export class TokenCreationService {
//   private static instance: TokenCreationService;

//   private constructor() {}

//   /**
//    * Get the singleton instance
//    */
//   public static getInstance(): TokenCreationService {
//     if (!TokenCreationService.instance) {
//       TokenCreationService.instance = new TokenCreationService();
//     }
//     return TokenCreationService.instance;
//   }

//   /**
//    * Create a new user token (complete two-step process)
//    * 
//    * @param name - Token name
//    * @param symbol - Token symbol
//    * @param totalSupply - Total token supply
//    * @returns The token details including mint address and AI Agent Token PDA
//    */
//   public async createToken(
//     name: string,
//     symbol: string,
//     totalSupply: number
//   ): Promise<{
//     mint: string;
//     aiAgentToken: string;
//     creator: string;
//     authority: string;
//     name: string;
//     symbol: string;
//     decimals: number;
//   }> {
//     // First step - Create token base
//     const mintKeypair = await this.createUserTokenBase(name, symbol, totalSupply);
    
//     // Second step - Create token mint
//     const tokenDetails = await this.createUserTokenMint(mintKeypair);
    
//     return {
//       mint: tokenDetails.mint.toString(),
//       aiAgentToken: tokenDetails.aiAgentToken.toString(),
//       creator: tokenDetails.creator.toString(),
//       authority: tokenDetails.authority.toString(),
//       name: tokenDetails.name,
//       symbol: tokenDetails.symbol,
//       decimals: 6 // User tokens use 6 decimals
//     };
//   }

//   /**
//    * First step of token creation - Create token base
//    * Validates requirements and prepares for token mint creation
//    * 
//    * @param name - Token name
//    * @param symbol - Token symbol
//    * @param totalSupply - Total token supply
//    * @returns The mint keypair for use in the second step
//    */
//   public async createUserTokenBase(
//     name: string,
//     symbol: string,
//     totalSupply: number
//   ): Promise<Keypair> {
//     // Get program and provider
//     const program = connectionService.getProgram();
//     const provider = connectionService.getProvider();
//     const creatorPubkey = provider.wallet.publicKey;
    
//     // Generate mint keypair
//     const mintKeypair = Keypair.generate();
//     console.log(`Generated mint keypair: ${mintKeypair.publicKey.toString()}`);
    
//     // Get config PDA
//     const configPda = connectionService.getConfigPda();
    
//     // Calculate user state PDA
//     const userStatePda = connectionService.getUserStatePda(creatorPubkey);
    
//     // Convert total supply to BN with 6 decimals (user tokens use 6 decimals)
//     const totalSupplyBN = new BN(totalSupply * 1_000_000);
    
//     // Execute createUserTokenBase instruction
//     const txId = await program.methods
//       .createUserTokenBase(name, symbol, totalSupplyBN)
//       .accounts({
//         config: configPda,
//         user: creatorPubkey,
//         userState: userStatePda,
//         mint: mintKeypair.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([mintKeypair])
//       .rpc({ commitment: 'confirmed' });
    
//     console.log(`✅ Successfully created token base! Tx: ${txId}`);
    
//     return mintKeypair;
//   }

//   /**
//    * Second step of token creation - Create token mint
//    * Creates the SPL token and AI Agent Token PDA
//    * 
//    * @param mintKeypair - Keypair for the token mint
//    * @returns Token details including mint, AI Agent Token PDA, etc.
//    */
//   public async createUserTokenMint(
//     mintKeypair: Keypair
//   ): Promise<{
//     mint: PublicKey;
//     aiAgentToken: PublicKey;
//     creator: PublicKey;
//     authority: PublicKey;
//     name: string;
//     symbol: string;
//   }> {
//     // Get program and provider
//     const program = connectionService.getProgram();
//     const provider = connectionService.getProvider();
//     const creatorPubkey = provider.wallet.publicKey;
    
//     // Get config PDA
//     const configPda = connectionService.getConfigPda();
    
//     // Get AI Agent Token PDA (uses 3 seeds with authority)
//     const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
//       creatorPubkey,
//       mintKeypair.publicKey
//     );
    
//     // Get creator's associated token account
//     const creatorTokenAccount = await getAssociatedTokenAddress(
//       mintKeypair.publicKey,
//       creatorPubkey
//     );
    
//     // Execute createUserTokenMint instruction
//     const txId = await program.methods
//       .createUserTokenMint()
//       .accounts({
//         config: configPda,
//         aiAgentToken: aiAgentTokenPda,
//         mint: mintKeypair.publicKey,
//         creator: creatorPubkey,
//         creatorTokenAccount: creatorTokenAccount,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       })
//       .signers([mintKeypair])
//       .rpc({ commitment: 'confirmed' });
    
//     console.log(`✅ Successfully created token mint! Tx: ${txId}`);
    
//     // Fetch AI Agent Token data
//     const aiAgentTokenData = await program.account.aiAgentToken.fetch(aiAgentTokenPda);
    
//     const tokenDetails = {
//       mint: mintKeypair.publicKey,
//       aiAgentToken: aiAgentTokenPda,
//       creator: creatorPubkey,
//       authority: aiAgentTokenData.authority,
//       name: aiAgentTokenData.name,
//       symbol: aiAgentTokenData.symbol
//     };
    
//     return tokenDetails;
//   }

//   /**
//    * Save token details to a file
//    * 
//    * @param tokenDetails - Token details object
//    * @param filename - Optional filename (default: token-details.json)
//    */
//   // public saveTokenDetails(
//   //   tokenDetails: any,
//   //   filename: string = 'token-details.json'
//   // ): void {
//   //   fs.writeFileSync(
//   //     filename,
//   //     JSON.stringify(tokenDetails, null, 2),
//   //     'utf-8'
//   //   );
//   //   console.log(`Token details saved to ${filename}`);
//   // }

//   /**
//    * Load token details from a file
//    * 
//    * @param filename - Token details filename
//    * @returns Token details object
//    */
//   // public loadTokenDetails(filename: string): any {
//   //   try {
//   //     const data = fs.readFileSync(filename, 'utf-8');
//   //     return JSON.parse(data);
//   //   } catch (error) {
//   //     throw new Error(`Failed to load token details: ${error.message}`);
//   //   }
//   // }
// }

// // Export singleton instance for easy import
// export const tokenCreationService = TokenCreationService.getInstance();



// import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
// import { BN } from '@coral-xyz/anchor';
// import { Yozoon } from '../idl/yozoon';
// import { Program } from '@coral-xyz/anchor';
// import { connectionService } from './connection-service';

// export class TokenCreationService {
//   private static instance: TokenCreationService;

//   private constructor() {}

//   public static getInstance(): TokenCreationService {
//     if (!TokenCreationService.instance) {
//       TokenCreationService.instance = new TokenCreationService();
//     }
//     return TokenCreationService.instance;
//   }

//   public async createToken(
//     name: string,
//     symbol: string,
//     totalSupply: number,
//     walletAddress: string
//   ): Promise<{
//     mint: string;
//     aiAgentToken: string;
//     creator: string;
//     authority: string;
//     name: string;
//     symbol: string;
//     decimals: number;
//   }> {
//     const creatorPubkey = new PublicKey(walletAddress);
//     const mintKeypair = await this.createUserTokenBase(name, symbol, totalSupply, creatorPubkey);
//     const tokenDetails = await this.createUserTokenMint(mintKeypair, creatorPubkey);

//     return {
//       mint: tokenDetails.mint.toString(),
//       aiAgentToken: tokenDetails.aiAgentToken.toString(),
//       creator: tokenDetails.creator.toString(),
//       authority: tokenDetails.authority.toString(),
//       name: tokenDetails.name,
//       symbol: tokenDetails.symbol,
//       decimals: 6
//     };
//   }

//   public async createUserTokenBase(
//     name: string,
//     symbol: string,
//     totalSupply: number,
//     creatorPubkey: PublicKey
//   ): Promise<Keypair> {
//     const program: Program<Yozoon> = connectionService.getProgram();
//     const mintKeypair = Keypair.generate();

//     const configPda = connectionService.getConfigPda();
//     const userStatePda = connectionService.getUserStatePda(creatorPubkey);
//     const totalSupplyBN = new BN(totalSupply * 1_000_000);

//     const txId = await program.methods
//       .createUserTokenBase(name, symbol, totalSupplyBN)
//       .accounts({
//         config: configPda,
//         user: creatorPubkey,
//         userState: userStatePda,
//         mint: mintKeypair.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([mintKeypair])
//       .rpc({ commitment: 'confirmed' });

//     console.log(`✅ Successfully created token base! Tx: ${txId}`);
//     return mintKeypair;
//   }

//   public async createUserTokenMint(
//     mintKeypair: Keypair,
//     creatorPubkey: PublicKey
//   ): Promise<{
//     mint: PublicKey;
//     aiAgentToken: PublicKey;
//     creator: PublicKey;
//     authority: PublicKey;
//     name: string;
//     symbol: string;
//   }> {
//     const program: Program<Yozoon> = connectionService.getProgram();

//     const configPda = connectionService.getConfigPda();
//     const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
//       creatorPubkey,
//       mintKeypair.publicKey
//     );

//     const creatorTokenAccount = await getAssociatedTokenAddress(
//       mintKeypair.publicKey,
//       creatorPubkey
//     );

//     const txId = await program.methods
//       .createUserTokenMint()
//       .accounts({
//         config: configPda,
//         aiAgentToken: aiAgentTokenPda,
//         mint: mintKeypair.publicKey,
//         creator: creatorPubkey,
//         creatorTokenAccount: creatorTokenAccount,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       })
//       .signers([mintKeypair])
//       .rpc({ commitment: 'confirmed' });

//     console.log(`✅ Successfully created token mint! Tx: ${txId}`);

//     const aiAgentTokenData = await program.account.aiAgentToken.fetch(aiAgentTokenPda);

//     return {
//       mint: mintKeypair.publicKey,
//       aiAgentToken: aiAgentTokenPda,
//       creator: creatorPubkey,
//       authority: aiAgentTokenData.authority,
//       name: aiAgentTokenData.name,
//       symbol: aiAgentTokenData.symbol
//     };
//   }
// }

// export const tokenCreationService = TokenCreationService.getInstance();


import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Yozoon } from '../idl/yozoon'; // Your IDL types
import { connectionService } from './connection-service';

export class TokenCreationService {
  private static instance: TokenCreationService;

  private constructor() {}

  public static getInstance(): TokenCreationService {
    if (!TokenCreationService.instance) {
      TokenCreationService.instance = new TokenCreationService();
    }
    return TokenCreationService.instance;
  }

  public async createToken(
    name: string,
    symbol: string,
    totalSupply: number,
    walletAddress: string
  ): Promise<{
    mint: string;
    aiAgentToken: string;
    creator: string;
    authority: string;
    name: string;
    symbol: string;
    decimals: number;
    txBase: string;
    txMint: string;
  }> {
    const creatorPubkey = new PublicKey(walletAddress);
    const mintKeypair = await this.createUserTokenBase(name, symbol, totalSupply, creatorPubkey);
    const tokenDetails = await this.createUserTokenMint(mintKeypair, creatorPubkey);

    return {
      mint: tokenDetails.mint.toString(),
      aiAgentToken: tokenDetails.aiAgentToken.toString(),
      creator: tokenDetails.creator.toString(),
      authority: tokenDetails.authority.toString(),
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      decimals: 6,
      txBase: tokenDetails.txBase,
      txMint: tokenDetails.txMint
    };
  }

  private async createUserTokenBase(
    name: string,
    symbol: string,
    totalSupply: number,
    creatorPubkey: PublicKey
  ): Promise<Keypair> {
    const program: Program<Yozoon> = connectionService.getProgram();
    const mintKeypair = Keypair.generate();

    const configPda = connectionService.getConfigPda();
    const userStatePda = connectionService.getUserStatePda(creatorPubkey);
    const totalSupplyBN = new BN(totalSupply * 1_000_000); // 6 decimals

    const tx = await program.methods
      .createUserTokenBase(name, symbol, totalSupplyBN)
      .accounts({
        config: configPda,
        user: creatorPubkey,
        userState: userStatePda,
        mint: mintKeypair.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([mintKeypair])
      .rpc();

    console.log(`✅ Token base created: ${tx}`);
    mintKeypair['txBase'] = tx; // saving txBase with keypair for use later
    return mintKeypair;
  }

  private async createUserTokenMint(
    mintKeypair: Keypair & { txBase?: string },
    creatorPubkey: PublicKey
  ): Promise<{
    mint: PublicKey;
    aiAgentToken: PublicKey;
    creator: PublicKey;
    authority: PublicKey;
    name: string;
    symbol: string;
    txBase: string;
    txMint: string;
  }> {
    const program: Program<Yozoon> = connectionService.getProgram();

    const configPda = connectionService.getConfigPda();
    const aiAgentTokenPda = connectionService.getAiAgentTokenPda(
      creatorPubkey,
      mintKeypair.publicKey
    );

    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      creatorPubkey
    );

    const tx = await program.methods
      .createUserTokenMint()
      .accounts({
        config: configPda,
        aiAgentToken: aiAgentTokenPda,
        mint: mintKeypair.publicKey,
        creator: creatorPubkey,
        creatorTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .signers([mintKeypair])
      .rpc();

    console.log(`✅ Token mint created: ${tx}`);

    const aiAgentTokenData = await program.account.aiAgentToken.fetch(aiAgentTokenPda);

    return {
      mint: mintKeypair.publicKey,
      aiAgentToken: aiAgentTokenPda,
      creator: creatorPubkey,
      authority: aiAgentTokenData.authority,
      name: aiAgentTokenData.name,
      symbol: aiAgentTokenData.symbol,
      txBase: mintKeypair.txBase || '',
      txMint: tx
    };
  }
}

export const tokenCreationService = TokenCreationService.getInstance();
