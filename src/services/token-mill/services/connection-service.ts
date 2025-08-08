// import { Connection, PublicKey, Keypair } from '@solana/web3.js';
// import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
// import { IDL } from '../types/yozoon';

// // Define the Yozoon program type
// type YozoonProgram = Program<typeof IDL>;

// /**
//  * ConnectionService handles wallet connections and program initialization
//  * for the Yozoon protocol.
//  */
// export class ConnectionService {
//   private static instance: ConnectionService;
//   private connection: Connection;
//   private programId: PublicKey;
//   private provider: AnchorProvider | null = null;
//   private program: YozoonProgram | null = null;

//   /**
//    * Creates a new ConnectionService instance
//    * @param rpcUrl - The RPC URL to connect to (default: devnet)
//    * @param programIdString - The program ID (default: program ID)
//    */
//   private constructor(
//     rpcUrl: string = 'https://api.devnet.solana.com', 
//     programIdString: string = 'shHfRtxvSycvcbPmxupqfr8XfkKp5zEfowxuKX25TAQ' 
//   ) {
//     this.connection = new Connection(rpcUrl, 'confirmed');
//     this.programId = new PublicKey(programIdString);
//   }

//   /**
//    * Get the singleton instance of ConnectionService
//    */
//   public static getInstance(): ConnectionService {
//     if (!ConnectionService.instance) {
//       ConnectionService.instance = new ConnectionService();
//     }
//     return ConnectionService.instance;
//   }

//   /**
//    * Configure the connection service with specific parameters
//    * @param rpcUrl - The RPC URL to connect to
//    * @param programIdString - The program ID string
//    */
//   public configure(rpcUrl: string, programIdString: string): void {
//     this.connection = new Connection(rpcUrl, 'confirmed');
//     this.programId = new PublicKey(programIdString);
//     this.provider = null;
//     this.program = null;
//   }

//   /**
//    * Get the Solana connection
//    */
//   public getConnection(): Connection {
//     return this.connection;
//   }

//   /**
//    * Get the program ID
//    */
//   public getProgramId(): PublicKey {
//     return this.programId;
//   }

//   /**
//    * Connect with a wallet
//    * @param wallet - The wallet to connect with
//    */
//   public connectWallet(wallet: Wallet): void {
//   this.provider = new AnchorProvider(
//     this.connection,
//     wallet,
//     { commitment: 'confirmed', preflightCommitment: 'confirmed' }
//   );
//   this.program = new Program(IDL as Yozoon, this.programId, this.provider) as YozoonProgram;
// }
//   /**
//    * Get the AnchorProvider (requires connected wallet)
//    */
//   public getProvider(): AnchorProvider {
//     if (!this.provider) {
//       throw new Error('No wallet connected. Call connectWallet first.');
//     }
//     return this.provider;
//   }

//   /**
//    * Get the Yozoon Program instance (requires connected wallet)
//    */
//   public getProgram(): YozoonProgram {
//     if (!this.program) {
//       throw new Error('No wallet connected. Call connectWallet first.');
//     }
//     return this.program;
//   }

//   /**
//    * Get config PDA
//    */
//   public getConfigPda(): PublicKey {
//     const [configPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('config')],
//       this.programId
//     );
//     return configPda;
//   }

//   /**
//    * Get user state PDA for a specific public key
//    * @param userPublicKey - The user public key
//    */
//   public getUserStatePda(userPublicKey: PublicKey): PublicKey {
//     const [userStatePda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('user_state'), userPublicKey.toBuffer()],
//       this.programId
//     );
//     return userStatePda;
//   }

//   /**
//    * Get AI Agent Token PDA
//    * @param authority - The authority public key
//    * @param mint - The token mint public key
//    */
//   public getAiAgentTokenPda(authority: PublicKey, mint: PublicKey): PublicKey {
//     const [aiAgentTokenPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('ai_agent_token'), authority.toBuffer(), mint.toBuffer()],
//       this.programId
//     );
//     return aiAgentTokenPda;
//   }

//   /**
//    * Get bonding curve PDA
//    */
//   public getBondingCurvePda(): PublicKey {
//     const [bondingCurvePda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('bonding_curve')],
//       this.programId
//     );
//     return bondingCurvePda;
//   }

//   /**
//    * Get airdrop ledger PDA
//    */
//   public getAirdropLedgerPda(): PublicKey {
//     const [airdropLedgerPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('airdrop_ledger')],
//       this.programId
//     );
//     return airdropLedgerPda;
//   }
// }

// // Export singleton instance for easy import
// export const connectionService = ConnectionService.getInstance();


import { Connection, PublicKey, Keypair, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet, setProvider } from '@coral-xyz/anchor';
 import { AnchorWallet } from '@solana/wallet-adapter-react';

import  IDL  from '../../token-mill/idl/yozoon.json';
import { Yozoon } from '../../token-mill/idl/yozoon';

// Define the Yozoon program type
type YozoonProgram = Program<typeof IDL>;

/**
 * ConnectionService handles wallet connections and program initialization
 * for the Yozoon protocol.
 */
export class ConnectionService {
  private static instance: ConnectionService;
  private connection: Connection;
  private programId: PublicKey;
  private provider: AnchorProvider | null = null;
  private program: YozoonProgram | null = null;

  /**
   * Creates a new ConnectionService instance
   * @param rpcUrl - The RPC URL to connect to (default: devnet)
   * @param programIdString - The program ID (default: program ID)
   */
  private constructor(
    rpcUrl: string = clusterApiUrl('devnet'),
    programIdString: string = 'shHfRtxvSycvcbPmxupqfr8XfkKp5zEfowxuKX25TAQ'
  ) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.programId = new PublicKey(programIdString);
  }

  /**
   * Get the singleton instance of ConnectionService
   */
  public static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService();
    }
    return ConnectionService.instance;
  }

  /**
   * Configure the connection service with specific parameters
   * @param rpcUrl - The RPC URL to connect to
   * @param programIdString - The program ID string
   */
  public configure(rpcUrl: string, programIdString: string): void {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.programId = new PublicKey(programIdString);
    this.provider = null;
    this.program = null;
  }

  /**
   * Get the Solana connection
   */
  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the program ID
   */
  public getProgramId(): PublicKey {
    return this.programId;
  }

  /**
   * Connect with a wallet
   * @param wallet - The wallet to connect with
   */
  public connectWallet(wallet: Wallet): void {
    const provider = new AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed', preflightCommitment: 'confirmed' }
    );
    this.provider = provider;
  setProvider(provider);


    this.program = new Program(IDL as Yozoon, provider) as YozoonProgram;
  }

  /**
   * Get the AnchorProvider (requires connected wallet)
   */
  // public getProvider(): AnchorProvider {
  //   if (!this.provider) {
  //     const wallet = (window as any).anchorWallet as Wallet;
  //     if (!wallet) throw new Error('No wallet connected. Connect your wallet first.');
  //     this.connectWallet(wallet);
  //   }
  //   return this.provider;
  // }



  public getProvider(): AnchorProvider {
  if (!this.provider) {
    if (typeof window === "undefined") {
      // We're in a backend context
      const dummyKeypair = Keypair.generate(); // (Or load from server keypair file)
      const dummyWallet: Wallet = {
        publicKey: dummyKeypair.publicKey,
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      };

      this.provider = new AnchorProvider(
        this.connection,
        dummyWallet,
        { commitment: "confirmed", preflightCommitment: "confirmed" }
      );
    } else {
      // We're in browser (frontend)
      const wallet = (window as any).anchorWallet as Wallet;
      if (!wallet) throw new Error("No wallet connected. Connect your wallet first.");
      this.connectWallet(wallet);
    }

    this.program = new Program(IDL as Yozoon, this.programId, this.provider) as YozoonProgram;
  }

  return this.provider;
}


  /**
   * Get the Yozoon Program instance (requires connected wallet)
   */
  public getProgram(): YozoonProgram {
    if (!this.program) {
      this.getProvider(); // This will initialize provider and program
    }
    return this.program!;
  }

  /**
   * Get config PDA
   */
  public getConfigPda(): PublicKey {
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.programId
    );
    return configPda;
  }

  /**
   * Get user state PDA for a specific public key
   * @param userPublicKey - The user public key
   */
  public getUserStatePda(userPublicKey: PublicKey): PublicKey {
    const [userStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user_state'), userPublicKey.toBuffer()],
      this.programId
    );
    return userStatePda;
  }

  /**
   * Get AI Agent Token PDA
   * @param authority - The authority public key
   * @param mint - The token mint public key
   */
  public getAiAgentTokenPda(authority: PublicKey, mint: PublicKey): PublicKey {
    const [aiAgentTokenPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('ai_agent_token'), authority.toBuffer(), mint.toBuffer()],
      this.programId
    );
    return aiAgentTokenPda;
  }

  /**
   * Get bonding curve PDA
   */
  public getBondingCurvePda(): PublicKey {
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('bonding_curve')],
      this.programId
    );
    return bondingCurvePda;
  }

  /**
   * Get airdrop ledger PDA
   */
  public getAirdropLedgerPda(): PublicKey {
    const [airdropLedgerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('airdrop_ledger')],
      this.programId
    );
    return airdropLedgerPda;
  }
}

// Export singleton instance for easy import
export const connectionService = ConnectionService.getInstance();
