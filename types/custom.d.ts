// src/types/custom.d.ts

declare module 'responselike' {
    // Define the types as per the module's documentation
    interface ResponseLike {
      status: number;
      headers: Record<string, string>;
      body: string;
      // ... other properties
    }
  
    export = ResponseLike;
  }
  
  declare module 'secp256k1' {
    // Define the types as per the module's documentation
    export function someFunction(): void;
    // ... other exports
  }
  