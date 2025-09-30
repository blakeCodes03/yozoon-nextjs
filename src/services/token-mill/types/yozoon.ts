/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/yozoon.json`.
 */
export type Yozoon = {
  "address": "8fBRE8jC7r4BmnbL7WVFBknLxWwzf6ETnBh6r7YJDocw",
  "metadata": {
    "name": "yozoon",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "airdropTokens",
      "discriminator": [
        242,
        252,
        19,
        227,
        43,
        233,
        89,
        122
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "Configuration account (PDA)"
          ],
          "writable": true
        },
        {
          "name": "admin",
          "docs": [
            "Configuration account (PDA)"
          ],
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "airdropLedger",
          "docs": [
            "Airdrop ledger account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112,
                  95,
                  108,
                  101,
                  100,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "Token mint account"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "Recipient's token account to receive airdropped tokens"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyTokens",
      "discriminator": [
        189,
        21,
        230,
        133,
        247,
        2,
        110,
        42
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata",
          "docs": [
            "Metadata account for this mint"
          ],
          "writable": true
        },
        {
          "name": "tokenMetadataProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "buyUserTokens",
      "discriminator": [
        14,
        123,
        250,
        65,
        71,
        132,
        213,
        39
      ],
      "accounts": [
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "aiAgentToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "ai_agent_token.authority",
                "account": "aiAgentToken"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "yozoonMint",
          "docs": [
            "The Yozoon token mint"
          ]
        },
        {
          "name": "tokenTreasury",
          "docs": [
            "Now these exist thanks to init above"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "platformTreasury",
          "writable": true
        },
        {
          "name": "reflectionTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "reflectionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyerUserState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "referrer",
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimAirdrop",
      "discriminator": [
        137,
        50,
        122,
        111,
        89,
        254,
        8,
        20
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "Configuration account (PDA)"
          ],
          "writable": true
        },
        {
          "name": "airdrop",
          "docs": [
            "Airdrop account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "recipient",
          "docs": [
            "Recipient claiming their airdrop (must match airdrop.recipient)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "Recipient's token account to receive tokens"
          ],
          "writable": true
        },
        {
          "name": "tokenMint",
          "docs": [
            "Token mint account"
          ],
          "writable": true
        },
        {
          "name": "airdropLedger",
          "docs": [
            "Airdrop ledger account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112,
                  95,
                  108,
                  101,
                  100,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account (for buyback)"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "claimMerkleAirdrop",
      "discriminator": [
        64,
        52,
        132,
        70,
        15,
        109,
        218,
        167
      ],
      "accounts": [
        {
          "name": "airdrop",
          "writable": true
        },
        {
          "name": "claimant",
          "writable": true,
          "signer": true
        },
        {
          "name": "claimStatus",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  117,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "airdrop"
              },
              {
                "kind": "account",
                "path": "claimant"
              }
            ]
          }
        },
        {
          "name": "claimantTokenAccount",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "proof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "claimReflection",
      "discriminator": [
        253,
        6,
        188,
        121,
        66,
        75,
        239,
        105
      ],
      "accounts": [
        {
          "name": "reflectionState",
          "writable": true
        },
        {
          "name": "userState",
          "writable": true
        },
        {
          "name": "claimer",
          "writable": true,
          "signer": true
        },
        {
          "name": "userTokenAccount",
          "docs": [
            "The claimer’s YOZOON token account (where reflections go)"
          ],
          "writable": true
        },
        {
          "name": "reflectionVault",
          "docs": [
            "The vault PDA holding the reflections"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "reflectionVaultTokenAccount",
          "docs": [
            "The vault’s SPL token ATA (holds YOZOON tokens)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "reflectionVault"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "yozoonMint",
          "docs": [
            "YOZOON mint"
          ]
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "claimUserTokenAirdrop",
      "discriminator": [
        237,
        228,
        225,
        103,
        84,
        233,
        41,
        152
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "ai_agent_token.authority",
                "account": "aiAgentToken"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ]
        },
        {
          "name": "airdrop",
          "docs": [
            "The airdrop account"
          ],
          "writable": true
        },
        {
          "name": "airdropTokenAccount",
          "docs": [
            "The airdrop token account (escrow)"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "The recipient's token account"
          ],
          "writable": true
        },
        {
          "name": "recipient",
          "docs": [
            "The recipient claiming tokens"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "yozoonTreasury",
          "docs": [
            "The Yozoon treasury account for buybacks"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "airdropId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createMerkleAirdrop",
      "discriminator": [
        90,
        140,
        123,
        107,
        48,
        144,
        3,
        37
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "merkleAirdrop",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  107,
                  108,
                  101,
                  95,
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "merkleAirdrop"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "merkleRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "expiration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "createMilestoneAirdrop",
      "discriminator": [
        43,
        218,
        19,
        159,
        80,
        186,
        121,
        145
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "Configuration account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "docs": [
            "Admin account (pays rent and creates airdrop)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "airdrop",
          "docs": [
            "Airdrop account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "recipient",
          "docs": [
            "Recipient of the airdrop"
          ]
        },
        {
          "name": "airdropLedger",
          "docs": [
            "Airdrop ledger account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112,
                  95,
                  108,
                  101,
                  100,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "Authority that can verify milestones (might be same as admin or designated verifier)"
          ]
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "milestones",
          "type": {
            "vec": {
              "defined": {
                "name": "milestone"
              }
            }
          }
        },
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "postClaimAction",
          "type": {
            "defined": {
              "name": "postClaimAction"
            }
          }
        }
      ]
    },
    {
      "name": "createUserToken",
      "discriminator": [
        142,
        186,
        189,
        137,
        119,
        3,
        231,
        131
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "The main Yozoon configuration"
          ]
        },
        {
          "name": "aiAgentToken",
          "docs": [
            "The new token's account (PDA derived from mint)"
          ]
        },
        {
          "name": "mint",
          "docs": [
            "The token mint to be created"
          ]
        },
        {
          "name": "creatorYozoonAccount",
          "docs": [
            "The creator's Yozoon token account (to verify minimum balance)"
          ]
        },
        {
          "name": "airdropAccount",
          "docs": [
            "The token account for the airdrop reserve"
          ]
        },
        {
          "name": "creatorTokenAccount",
          "docs": [
            "The creator's token account for the new token"
          ]
        },
        {
          "name": "creator",
          "docs": [
            "The creator who's paying for the token creation"
          ],
          "signer": true
        },
        {
          "name": "userState",
          "docs": [
            "User state account to track referrals"
          ]
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account to receive the creation fee"
          ]
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ]
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Associated token program"
          ]
        },
        {
          "name": "rent",
          "docs": [
            "Rent sysvar"
          ]
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "totalSupply",
          "type": "u64"
        },
        {
          "name": "initialPrice",
          "type": "u64"
        },
        {
          "name": "kFactor",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createUserTokenAirdrop",
      "discriminator": [
        171,
        211,
        125,
        120,
        83,
        38,
        17,
        58
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ]
        },
        {
          "name": "airdrop",
          "docs": [
            "The airdrop account to be created"
          ],
          "writable": true
        },
        {
          "name": "sourceTokenAccount",
          "docs": [
            "Source token account (airdrop reserve)"
          ],
          "writable": true
        },
        {
          "name": "airdropTokenAccount",
          "docs": [
            "Temporary escrow account for airdrop tokens"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "docs": [
            "The authority (must be token creator)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "docs": [
            "Rent sysvar"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "airdropId",
          "type": "u8"
        },
        {
          "name": "milestones",
          "type": {
            "vec": {
              "defined": {
                "name": "milestone"
              }
            }
          }
        },
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "durationDays",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createUserTokenBase",
      "discriminator": [
        81,
        166,
        142,
        64,
        178,
        245,
        222,
        30
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "The main Yozoon configuration"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "docs": [
            "The creator who's paying for the token creation"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "userState",
          "docs": [
            "User state account to track referrals"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creatorYozoonAccount",
          "docs": [
            "The creator's Yozoon token account (to verify minimum balance)"
          ]
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account to receive the creation fee"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ]
        },
        {
          "name": "rent",
          "docs": [
            "Rent sysvar"
          ]
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "totalSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createUserTokenMint",
      "discriminator": [
        111,
        67,
        62,
        123,
        12,
        109,
        239,
        31
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "The main Yozoon configuration (read-only for validation)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "docs": [
            "Creator paying for everything"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "aiAgentToken",
          "docs": [
            "PDA state for this user token"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The SPL Mint for this new user token"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "yozoonMint",
          "docs": [
            "The global Yozoon token mint (used for reflections)"
          ]
        },
        {
          "name": "airdropAccount",
          "docs": [
            "ATAs (created via CPI)"
          ],
          "writable": true
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "reflectionState",
          "docs": [
            "Global reflection state (struct)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "tokenTreasury",
          "docs": [
            "Per-token treasury (for SOL raised by this mint)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "reflectionTreasury",
          "docs": [
            "Global reflection treasury (SOL distribution pool)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "docs": [
            "Metaplex metadata"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "totalSupply",
          "type": "u64"
        },
        {
          "name": "initialPrice",
          "type": "u64"
        },
        {
          "name": "kFactor",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getUserTokenPrice",
      "discriminator": [
        102,
        81,
        66,
        129,
        142,
        76,
        184,
        46
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "ai_agent_token.authority",
                "account": "aiAgentToken"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ]
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "initializeBondingCurve",
      "discriminator": [
        140,
        201,
        166,
        55,
        224,
        232,
        206,
        114
      ],
      "accounts": [
        {
          "name": "bondingCurve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pricePoints",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "initializeMint",
      "discriminator": [
        209,
        42,
        195,
        4,
        129,
        85,
        209,
        44
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "reflectionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeUserState",
      "discriminator": [
        243,
        232,
        125,
        241,
        54,
        4,
        241,
        222
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "The user creating their state"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "userState",
          "docs": [
            "The user's state PDA (created once)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "migrateToRaydium",
      "discriminator": [
        116,
        139,
        75,
        192,
        86,
        63,
        121,
        169
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "migrateUserToken",
      "discriminator": [
        42,
        207,
        166,
        62,
        54,
        207,
        102,
        70
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "The main Yozoon configuration"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account to migrate"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ],
          "writable": true
        },
        {
          "name": "wrappedSol",
          "docs": [
            "Wrapped SOL mint"
          ]
        },
        {
          "name": "tokenTreasury",
          "docs": [
            "The program-controlled treasury account for the token creator."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "docs": [
            "Project token account for pool liquidity"
          ],
          "writable": true
        },
        {
          "name": "solTokenAccount",
          "docs": [
            "SOL token account for pool liquidity"
          ],
          "writable": true
        },
        {
          "name": "lpMint",
          "docs": [
            "LP token mint (to be created)"
          ],
          "writable": true
        },
        {
          "name": "feeAccount",
          "docs": [
            "Fee account for pool fees"
          ],
          "writable": true
        },
        {
          "name": "nftMint",
          "docs": [
            "NFT mint for fee key"
          ],
          "writable": true
        },
        {
          "name": "raydiumPool",
          "docs": [
            "Raydium pool account (PDA to be created)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  121,
                  100,
                  105,
                  117,
                  109,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "feeKeyNft",
          "docs": [
            "Fee key NFT account (PDA to be created)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  102,
                  101,
                  101,
                  95,
                  107,
                  101,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "raydiumPool"
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "Authority initiating the migration (token creator or admin)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "raydiumProgram",
          "docs": [
            "Raydium AMM program"
          ],
          "address": "HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"
        },
        {
          "name": "feeKeyProgram",
          "docs": [
            "Raydium Fee Key program"
          ],
          "address": "HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "docs": [
            "Rent sysvar"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "processExpiredUserTokenAirdrop",
      "discriminator": [
        12,
        129,
        120,
        113,
        218,
        5,
        23,
        243
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "ai_agent_token.authority",
                "account": "aiAgentToken"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ]
        },
        {
          "name": "airdrop",
          "docs": [
            "The airdrop account"
          ],
          "writable": true
        },
        {
          "name": "airdropTokenAccount",
          "docs": [
            "The airdrop token account (escrow)"
          ],
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "The recipient's token account"
          ],
          "writable": true
        },
        {
          "name": "recipient",
          "docs": [
            "The recipient claiming tokens"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "yozoonTreasury",
          "docs": [
            "The Yozoon treasury account for buybacks"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "airdropId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sellUserTokens",
      "discriminator": [
        80,
        235,
        216,
        44,
        227,
        44,
        92,
        254
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The AI Agent token metadata/state"
          ],
          "writable": true
        },
        {
          "name": "mint",
          "docs": [
            "The user token mint"
          ],
          "writable": true
        },
        {
          "name": "sellerTokenAccount",
          "docs": [
            "The seller’s token account for this mint"
          ],
          "writable": true
        },
        {
          "name": "seller",
          "docs": [
            "The seller who is burning tokens"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenTreasury",
          "docs": [
            "Program-controlled treasury PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "reflectionVault",
          "docs": [
            "Reflection vault PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ]
          }
        },
        {
          "name": "yozoonMint",
          "docs": [
            "YOZOON mint"
          ]
        },
        {
          "name": "reflectionState",
          "docs": [
            "Reflection state PDA"
          ],
          "writable": true
        },
        {
          "name": "userState",
          "docs": [
            "User state (stores referrer pubkey if any)"
          ],
          "writable": true
        },
        {
          "name": "referrer",
          "docs": [
            "Referrer account (must match user_state.referrer if Some)"
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Programs"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setUserReferrer",
      "discriminator": [
        71,
        167,
        153,
        60,
        26,
        30,
        50,
        114
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "The user setting their referrer"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "userState",
          "docs": [
            "The user's state account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "referrer",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "settleReflections",
      "discriminator": [
        220,
        157,
        113,
        77,
        52,
        157,
        89,
        187
      ],
      "accounts": [
        {
          "name": "reflectionState",
          "writable": true
        },
        {
          "name": "reflectionVault",
          "docs": [
            "PDA holding SOL from fees"
          ],
          "writable": true
        },
        {
          "name": "bondingCurve",
          "docs": [
            "Bonding curve state (decides migrated vs not)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "yozoonMint",
          "docs": [
            "YOZOON Mint"
          ],
          "writable": true
        },
        {
          "name": "reflectionVaultTokenAccount",
          "docs": [
            "Token account owned by Reflection Vault PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "reflectionVault"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "yozoonMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "config",
          "docs": [
            "Config PDA (mint authority of YOZOON)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "Programs"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "verifyMilestone",
      "discriminator": [
        33,
        124,
        38,
        194,
        150,
        153,
        90,
        227
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "Configuration account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "airdrop",
          "docs": [
            "Airdrop account (PDA)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  100,
                  114,
                  111,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "airdrop.recipient",
                "account": "airdrop"
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "Authority account that can verify milestones"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "taskVerification",
          "docs": [
            "Task verification account (optional, for off-chain task proofs)"
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "milestoneIndex",
          "type": "u8"
        },
        {
          "name": "verificationHash",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "verifyUserTokenMilestone",
      "discriminator": [
        254,
        59,
        244,
        18,
        194,
        4,
        129,
        10
      ],
      "accounts": [
        {
          "name": "aiAgentToken",
          "docs": [
            "The user token account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  95,
                  97,
                  103,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "ai_agent_token.authority",
                "account": "aiAgentToken"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "docs": [
            "The token mint"
          ]
        },
        {
          "name": "airdrop",
          "docs": [
            "The airdrop account to verify milestone for"
          ],
          "writable": true
        },
        {
          "name": "authority",
          "docs": [
            "The authority (must be token creator)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "airdropId",
          "type": "u8"
        },
        {
          "name": "milestoneIndex",
          "type": "u8"
        },
        {
          "name": "verificationProof",
          "type": {
            "option": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "aiAgentToken",
      "discriminator": [
        36,
        148,
        223,
        232,
        150,
        102,
        208,
        85
      ]
    },
    {
      "name": "airdrop",
      "discriminator": [
        31,
        112,
        159,
        158,
        124,
        237,
        9,
        241
      ]
    },
    {
      "name": "airdropLedger",
      "discriminator": [
        85,
        251,
        210,
        98,
        196,
        120,
        98,
        43
      ]
    },
    {
      "name": "bondingCurve",
      "discriminator": [
        23,
        183,
        248,
        55,
        96,
        216,
        172,
        96
      ]
    },
    {
      "name": "claimStatus",
      "discriminator": [
        22,
        183,
        249,
        157,
        247,
        95,
        150,
        96
      ]
    },
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "feeKeyNft",
      "discriminator": [
        159,
        162,
        164,
        109,
        153,
        153,
        71,
        72
      ]
    },
    {
      "name": "merkleAirdrop",
      "discriminator": [
        86,
        93,
        215,
        62,
        159,
        242,
        77,
        220
      ]
    },
    {
      "name": "raydiumPool",
      "discriminator": [
        111,
        167,
        50,
        181,
        73,
        240,
        185,
        60
      ]
    },
    {
      "name": "reflectionState",
      "discriminator": [
        79,
        138,
        183,
        80,
        204,
        192,
        140,
        22
      ]
    },
    {
      "name": "taskVerification",
      "discriminator": [
        230,
        125,
        193,
        112,
        243,
        217,
        133,
        229
      ]
    },
    {
      "name": "userState",
      "discriminator": [
        72,
        177,
        85,
        249,
        76,
        167,
        186,
        126
      ]
    },
    {
      "name": "userTokenAirdrop",
      "discriminator": [
        235,
        33,
        4,
        213,
        92,
        187,
        126,
        169
      ]
    }
  ],
  "events": [
    {
      "name": "adminAcceptedEvent",
      "discriminator": [
        14,
        221,
        60,
        92,
        241,
        147,
        95,
        66
      ]
    },
    {
      "name": "adminTransferCompletedEvent",
      "discriminator": [
        45,
        61,
        146,
        62,
        46,
        238,
        84,
        243
      ]
    },
    {
      "name": "adminTransferInitiatedEvent",
      "discriminator": [
        227,
        26,
        43,
        16,
        228,
        108,
        170,
        243
      ]
    },
    {
      "name": "adminTransferredEvent",
      "discriminator": [
        158,
        233,
        64,
        41,
        184,
        122,
        98,
        76
      ]
    },
    {
      "name": "airdropClaimedEvent",
      "discriminator": [
        152,
        147,
        197,
        184,
        147,
        73,
        167,
        29
      ]
    },
    {
      "name": "airdropCreatedEvent",
      "discriminator": [
        34,
        35,
        133,
        242,
        182,
        253,
        47,
        61
      ]
    },
    {
      "name": "airdropEvent",
      "discriminator": [
        152,
        190,
        100,
        178,
        216,
        22,
        44,
        199
      ]
    },
    {
      "name": "bondingCurveInitializedEvent",
      "discriminator": [
        155,
        210,
        20,
        121,
        189,
        208,
        223,
        2
      ]
    },
    {
      "name": "migrationCompletedEvent",
      "discriminator": [
        188,
        136,
        172,
        224,
        135,
        77,
        206,
        225
      ]
    },
    {
      "name": "migrationEvent",
      "discriminator": [
        255,
        202,
        76,
        147,
        91,
        231,
        73,
        22
      ]
    },
    {
      "name": "migrationReadyEvent",
      "discriminator": [
        120,
        196,
        58,
        20,
        86,
        254,
        112,
        140
      ]
    },
    {
      "name": "milestoneVerifiedEvent",
      "discriminator": [
        180,
        66,
        163,
        104,
        236,
        104,
        48,
        210
      ]
    },
    {
      "name": "mintInitializedEvent",
      "discriminator": [
        102,
        204,
        136,
        135,
        40,
        203,
        84,
        147
      ]
    },
    {
      "name": "pauseStateChangedEvent",
      "discriminator": [
        142,
        29,
        26,
        107,
        147,
        150,
        52,
        254
      ]
    },
    {
      "name": "priceCalculatedEvent",
      "discriminator": [
        68,
        169,
        27,
        41,
        247,
        206,
        182,
        133
      ]
    },
    {
      "name": "referralCreatedEvent",
      "discriminator": [
        100,
        183,
        126,
        166,
        164,
        104,
        232,
        130
      ]
    },
    {
      "name": "referralFeeDistributedEvent",
      "discriminator": [
        183,
        236,
        1,
        20,
        42,
        43,
        235,
        187
      ]
    },
    {
      "name": "referralFeeUpdatedEvent",
      "discriminator": [
        151,
        43,
        253,
        110,
        236,
        125,
        143,
        235
      ]
    },
    {
      "name": "referralSetEvent",
      "discriminator": [
        105,
        27,
        252,
        191,
        163,
        208,
        1,
        109
      ]
    },
    {
      "name": "referrerSetEvent",
      "discriminator": [
        215,
        99,
        212,
        140,
        59,
        239,
        95,
        35
      ]
    },
    {
      "name": "reflectionAdded",
      "discriminator": [
        86,
        235,
        182,
        181,
        148,
        169,
        242,
        143
      ]
    },
    {
      "name": "reflectionClaimed",
      "discriminator": [
        0,
        255,
        48,
        124,
        196,
        76,
        98,
        39
      ]
    },
    {
      "name": "reflectionClaimedEvent",
      "discriminator": [
        42,
        2,
        207,
        177,
        72,
        83,
        229,
        31
      ]
    },
    {
      "name": "reflectionSettled",
      "discriminator": [
        179,
        120,
        30,
        129,
        227,
        208,
        192,
        95
      ]
    },
    {
      "name": "tokenCalculationEvent",
      "discriminator": [
        129,
        44,
        100,
        96,
        237,
        109,
        128,
        45
      ]
    },
    {
      "name": "tokenPurchaseEvent",
      "discriminator": [
        15,
        60,
        99,
        205,
        190,
        222,
        240,
        140
      ]
    },
    {
      "name": "tokenSaleEvent",
      "discriminator": [
        149,
        179,
        200,
        64,
        35,
        145,
        56,
        203
      ]
    },
    {
      "name": "tokensPurchasedEvent",
      "discriminator": [
        219,
        129,
        186,
        70,
        149,
        19,
        83,
        237
      ]
    },
    {
      "name": "tokensStakedEvent",
      "discriminator": [
        218,
        197,
        87,
        223,
        185,
        138,
        202,
        82
      ]
    },
    {
      "name": "tokensUnstakedEvent",
      "discriminator": [
        67,
        66,
        93,
        2,
        56,
        119,
        159,
        186
      ]
    },
    {
      "name": "userTokenAirdropClaimedEvent",
      "discriminator": [
        31,
        248,
        102,
        219,
        225,
        142,
        76,
        126
      ]
    },
    {
      "name": "userTokenAirdropCreatedEvent",
      "discriminator": [
        98,
        88,
        97,
        11,
        49,
        136,
        159,
        230
      ]
    },
    {
      "name": "userTokenAirdropExpiredEvent",
      "discriminator": [
        44,
        176,
        66,
        202,
        37,
        199,
        183,
        166
      ]
    },
    {
      "name": "userTokenCreatedEvent",
      "discriminator": [
        66,
        146,
        182,
        3,
        172,
        158,
        4,
        75
      ]
    },
    {
      "name": "userTokenMigratedEvent",
      "discriminator": [
        224,
        182,
        245,
        244,
        58,
        132,
        171,
        20
      ]
    },
    {
      "name": "userTokenMilestoneVerifiedEvent",
      "discriminator": [
        187,
        28,
        202,
        133,
        121,
        119,
        48,
        59
      ]
    },
    {
      "name": "userTokenPriceEvent",
      "discriminator": [
        191,
        101,
        167,
        91,
        193,
        174,
        44,
        173
      ]
    },
    {
      "name": "userTokenPurchaseEvent",
      "discriminator": [
        47,
        156,
        34,
        29,
        223,
        249,
        163,
        7
      ]
    },
    {
      "name": "userTokenSaleEvent",
      "discriminator": [
        222,
        68,
        74,
        255,
        252,
        41,
        197,
        231
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientYozoonBalance",
      "msg": "Insufficient Yozoon balance to create token"
    },
    {
      "code": 6001,
      "name": "nameTooShort",
      "msg": "Token name too short"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "Token name too long"
    },
    {
      "code": 6003,
      "name": "symbolTooShort",
      "msg": "Token symbol too short"
    },
    {
      "code": 6004,
      "name": "symbolTooLong",
      "msg": "Token symbol too long"
    },
    {
      "code": 6005,
      "name": "invalidBondingCurveParams",
      "msg": "Invalid bonding curve parameters"
    },
    {
      "code": 6006,
      "name": "totalSupplyTooLow",
      "msg": "Total supply too low"
    },
    {
      "code": 6007,
      "name": "totalSupplyTooHigh",
      "msg": "Total supply too high"
    },
    {
      "code": 6008,
      "name": "invalidTokenCreationFee",
      "msg": "Invalid token creation fee"
    },
    {
      "code": 6009,
      "name": "notTokenAuthority",
      "msg": "Not the token authority"
    },
    {
      "code": 6010,
      "name": "calculationOverflow",
      "msg": "Calculation overflow"
    },
    {
      "code": 6011,
      "name": "invalidAirdropPercentage",
      "msg": "Invalid airdrop percentage"
    },
    {
      "code": 6012,
      "name": "invalidParameter",
      "msg": "Invalid parameter"
    }
  ],
  "types": [
    {
      "name": "adminAcceptedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "adminTransferCompletedEvent",
      "docs": [
        "Event emitted when admin transfer is completed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAdmin",
            "docs": [
              "New admin address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "adminTransferInitiatedEvent",
      "docs": [
        "Event emitted when admin transfer is initiated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentAdmin",
            "docs": [
              "Current admin address"
            ],
            "type": "pubkey"
          },
          {
            "name": "proposedAdmin",
            "docs": [
              "Proposed new admin address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "adminTransferredEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldAdmin",
            "type": "pubkey"
          },
          {
            "name": "newAdmin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "aiAgentToken",
      "docs": [
        "Account for storing user-created token information"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "Creator/authority of the token"
            ],
            "type": "pubkey"
          },
          {
            "name": "bondingCurveParams",
            "docs": [
              "Bonding curve parameters for price calculation"
            ],
            "type": {
              "defined": {
                "name": "bondingCurveParams"
              }
            }
          },
          {
            "name": "totalSupply",
            "docs": [
              "Total supply of the token"
            ],
            "type": "u64"
          },
          {
            "name": "currentSupply",
            "docs": [
              "Current circulating supply"
            ],
            "type": "u64"
          },
          {
            "name": "totalSolRaised",
            "docs": [
              "Total SOL raised through purchases"
            ],
            "type": "u64"
          },
          {
            "name": "airdropReserve",
            "docs": [
              "ATA for airdrop reserve"
            ],
            "type": "pubkey"
          },
          {
            "name": "isMigrated",
            "docs": [
              "Whether the token has migrated to Raydium"
            ],
            "type": "bool"
          },
          {
            "name": "creationTimestamp",
            "docs": [
              "Creation timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "name",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Token symbol"
            ],
            "type": "string"
          },
          {
            "name": "image",
            "docs": [
              "Token Image"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "airdrop",
      "docs": [
        "Advanced airdrop account for milestone-based unlocking"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "docs": [
              "Recipient of the airdrop"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "Authority that can verify milestones (admin or designated verifier)"
            ],
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "docs": [
              "Total amount allocated for this airdrop"
            ],
            "type": "u64"
          },
          {
            "name": "claimedAmount",
            "docs": [
              "Amount already claimed"
            ],
            "type": "u64"
          },
          {
            "name": "milestones",
            "docs": [
              "List of milestones that unlock portions of the airdrop"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "milestone"
                }
              }
            }
          },
          {
            "name": "postClaimAction",
            "docs": [
              "Action to take after a claim (burn or buyback)"
            ],
            "type": {
              "defined": {
                "name": "postClaimAction"
              }
            }
          },
          {
            "name": "creationTime",
            "docs": [
              "Timestamp when the airdrop was created"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "airdropClaimedEvent",
      "docs": [
        "Event emitted when airdrop tokens are claimed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "airdrop",
            "docs": [
              "Airdrop being claimed"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "docs": [
              "Recipient of the airdrop"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount claimed"
            ],
            "type": "u64"
          },
          {
            "name": "processedAmount",
            "docs": [
              "Amount processed by post-claim action (burned or sent for buyback)"
            ],
            "type": "u64"
          },
          {
            "name": "actionType",
            "docs": [
              "Type of post-claim action performed"
            ],
            "type": "string"
          },
          {
            "name": "timestamp",
            "docs": [
              "Timestamp of the claim"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "airdropCreatedEvent",
      "docs": [
        "Event emitted when an advanced airdrop is created with milestones"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "docs": [
              "Recipient of the airdrop"
            ],
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "docs": [
              "Total amount allocated"
            ],
            "type": "u64"
          },
          {
            "name": "milestoneCount",
            "docs": [
              "Number of milestones"
            ],
            "type": "u8"
          },
          {
            "name": "authority",
            "docs": [
              "Authority that can verify milestones"
            ],
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "docs": [
              "Timestamp of the airdrop creation"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "airdropEvent",
      "docs": [
        "Event emitted when tokens are airdropped"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "docs": [
              "Recipient of airdropped tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens airdropped"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of airdrop"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "airdropLedger",
      "docs": [
        "Airdrop ledger account tracking total tokens airdropped"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalAirdropped",
            "docs": [
              "Total tokens airdropped"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bondingCurve",
      "docs": [
        "Bonding curve state account storing price points and supply data"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalSolRaised",
            "docs": [
              "Total SOL collected (net of fees)"
            ],
            "type": "u64"
          },
          {
            "name": "totalSoldSupply",
            "docs": [
              "Total tokens sold via bonding curve"
            ],
            "type": "u64"
          },
          {
            "name": "pricePoints",
            "docs": [
              "Precomputed price points for the curve"
            ],
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "isMigrated",
            "docs": [
              "Migration status"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "bondingCurveInitializedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "pricePoints",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bondingCurveParams",
      "docs": [
        "Bonding curve parameters for user-created tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialPrice",
            "docs": [
              "Initial token price (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "kFactor",
            "docs": [
              "K factor for exponential curve (P = P₀·e^(k·S))"
            ],
            "type": "u64"
          },
          {
            "name": "precisionFactor",
            "docs": [
              "Precision factor for calculations"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "claimStatus",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "config",
      "docs": [
        "Configuration account holding admin info and program settings"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin public key for restricted actions"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "Token mint public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "paused",
            "docs": [
              "Emergency pause flag"
            ],
            "type": "bool"
          },
          {
            "name": "treasury",
            "docs": [
              "Treasury account for project fees"
            ],
            "type": "pubkey"
          },
          {
            "name": "pendingAdmin",
            "docs": [
              "Pending admin for ownership transfer"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "totalValue",
            "docs": [
              "Total value of the project"
            ],
            "type": "u64"
          },
          {
            "name": "totalSupply",
            "docs": [
              "Total supply of the project"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "feeKeyNft",
      "docs": [
        "Raydium Fee Key NFT state"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "NFT mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "Owner of the fee key"
            ],
            "type": "pubkey"
          },
          {
            "name": "pool",
            "docs": [
              "Associated pool"
            ],
            "type": "pubkey"
          },
          {
            "name": "feePercentage",
            "docs": [
              "Fee percentage in basis points (e.g., 500 = 5%)"
            ],
            "type": "u64"
          },
          {
            "name": "lastClaimed",
            "docs": [
              "Last claimed timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump for PDA derivation"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "merkleAirdrop",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "merkleRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "creationTime",
            "type": "i64"
          },
          {
            "name": "expiration",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "migrationCompletedEvent",
      "docs": [
        "Event emitted when migration to Raydium is completed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "solValue",
            "docs": [
              "Total SOL value in treasury"
            ],
            "type": "u64"
          },
          {
            "name": "tokensSold",
            "docs": [
              "Total tokens sold"
            ],
            "type": "u64"
          },
          {
            "name": "admin",
            "docs": [
              "Admin who performed migration"
            ],
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of migration"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "migrationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalSol",
            "type": "u64"
          },
          {
            "name": "totalUsd",
            "type": "u64"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "migrationReadyEvent",
      "docs": [
        "Event emitted when migration threshold is reached"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalSol",
            "type": "u64"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "docs": [
        "Represents a single milestone in an airdrop"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "docs": [
              "Description of the milestone (max 50 chars)"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens to unlock when this milestone is reached"
            ],
            "type": "u64"
          },
          {
            "name": "expectedCompletionTime",
            "docs": [
              "Unix timestamp when the milestone is expected to be completed"
            ],
            "type": "i64"
          },
          {
            "name": "status",
            "docs": [
              "Status of the milestone"
            ],
            "type": {
              "defined": {
                "name": "milestoneStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "milestoneStatus",
      "docs": [
        "Represents the status of a milestone"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "completed"
          },
          {
            "name": "claimed"
          }
        ]
      }
    },
    {
      "name": "milestoneVerifiedEvent",
      "docs": [
        "Event emitted when a milestone is verified"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "airdrop",
            "docs": [
              "Airdrop this milestone belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "docs": [
              "Recipient of the airdrop"
            ],
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "docs": [
              "Index of the milestone"
            ],
            "type": "u8"
          },
          {
            "name": "amount",
            "docs": [
              "Amount unlocked by this milestone"
            ],
            "type": "u64"
          },
          {
            "name": "authority",
            "docs": [
              "Authority that verified the milestone"
            ],
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "docs": [
              "Timestamp of verification"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "mintInitializedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "pauseStateChangedEvent",
      "docs": [
        "Event emitted when pause state is changed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "docs": [
              "New pause state (true = paused)"
            ],
            "type": "bool"
          },
          {
            "name": "admin",
            "docs": [
              "Admin who changed pause state"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "postClaimAction",
      "docs": [
        "Represents the type of post-claim action"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "burn",
            "fields": [
              {
                "name": "percentage",
                "type": "u8"
              }
            ]
          },
          {
            "name": "buyback",
            "fields": [
              {
                "name": "percentage",
                "type": "u8"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "priceCalculatedEvent",
      "docs": [
        "Event emitted when token price is calculated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "supply",
            "docs": [
              "Current token supply"
            ],
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Calculated price"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of calculation"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "raydiumPool",
      "docs": [
        "Raydium Liquidity Pool state"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Pool authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenAMint",
            "docs": [
              "Token A mint (project token)"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenBMint",
            "docs": [
              "Token B mint (SOL)"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenAAccount",
            "docs": [
              "Token A pool account"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenBAccount",
            "docs": [
              "Token B pool account"
            ],
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "docs": [
              "LP token mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "feeAccount",
            "docs": [
              "Fee account (for fee distribution)"
            ],
            "type": "pubkey"
          },
          {
            "name": "initTimestamp",
            "docs": [
              "Pool initialization timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump for PDA derivation"
            ],
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "docs": [
              "Whether the pool has been initialized"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "referralCreatedEvent",
      "docs": [
        "Event emitted when a referral is created"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User who was referred"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "docs": [
              "Referrer's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "feePercentage",
            "docs": [
              "Fee percentage in basis points"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "referralFeeDistributedEvent",
      "docs": [
        "Event emitted when referral fee is distributed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referrer",
            "docs": [
              "Referrer who received the fee"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrerShare",
            "docs": [
              "Amount received by referrer"
            ],
            "type": "u64"
          },
          {
            "name": "reflectionShare",
            "docs": [
              "Amount allocated to YOZOON reflection"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of distribution"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "referralFeeUpdatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "oldFee",
            "type": "u64"
          },
          {
            "name": "newFee",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "referralSetEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "referrerSetEvent",
      "docs": [
        "Event emitted when a referrer is set for a user"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User who set the referrer"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "docs": [
              "Referrer's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reflectionAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reflectionClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reflectionClaimedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reflectionSettled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reflectionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalDistributed",
            "type": "u64"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "vaultBalance",
            "type": "u64"
          },
          {
            "name": "lastSettlement",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "taskVerification",
      "docs": [
        "Account for off-chain task verification"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "airdrop",
            "docs": [
              "The airdrop this verification is for"
            ],
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "docs": [
              "The milestone index this verification applies to"
            ],
            "type": "u8"
          },
          {
            "name": "verificationHash",
            "docs": [
              "Verification hash (hash of the completed task proof)"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "verificationTime",
            "docs": [
              "Timestamp when the verification was submitted"
            ],
            "type": "i64"
          },
          {
            "name": "verifier",
            "docs": [
              "Authority that verified the task"
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenCalculationEvent",
      "docs": [
        "Event emitted when calculating tokens for a given SOL amount"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "solAmount",
            "docs": [
              "Input SOL amount"
            ],
            "type": "u64"
          },
          {
            "name": "netSol",
            "docs": [
              "Net SOL after referral fees"
            ],
            "type": "u64"
          },
          {
            "name": "tokens",
            "docs": [
              "Calculated token amount"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of calculation"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokenPurchaseEvent",
      "docs": [
        "Event emitted when tokens are purchased"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User who purchased tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount of SOL provided (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "netSol",
            "docs": [
              "Net SOL amount after fees (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "tokens",
            "docs": [
              "Number of tokens received"
            ],
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Price per token"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of the transaction"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokenSaleEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokensPurchasedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokensStakedEvent",
      "docs": [
        "Event emitted when tokens are staked for referral fee reduction"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User who staked tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens staked"
            ],
            "type": "u64"
          },
          {
            "name": "newStakedTotal",
            "docs": [
              "New total staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "newFeePercentage",
            "docs": [
              "New fee percentage after reduction"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of the stake"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokensUnstakedEvent",
      "docs": [
        "Event emitted when tokens are unstaked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User who unstaked tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens unstaked"
            ],
            "type": "u64"
          },
          {
            "name": "newStakedTotal",
            "docs": [
              "New total staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "newFeePercentage",
            "docs": [
              "New fee percentage after recalculation"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of the unstake"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userState",
      "docs": [
        "Account for tracking user state and referrals"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "docs": [
              "Referrer's public key if set"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "totalClaimed",
            "docs": [
              "Total reflections already claimed by this user"
            ],
            "type": "u64"
          },
          {
            "name": "createdAt",
            "docs": [
              "Creation timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userTokenAirdrop",
      "docs": [
        "Account for storing user token airdrop information"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "docs": [
              "The token this airdrop is for"
            ],
            "type": "pubkey"
          },
          {
            "name": "aiAgentToken",
            "docs": [
              "The ai agent token account"
            ],
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "docs": [
              "Total amount allocated for this airdrop"
            ],
            "type": "u64"
          },
          {
            "name": "claimedAmount",
            "docs": [
              "Amount already claimed"
            ],
            "type": "u64"
          },
          {
            "name": "milestones",
            "docs": [
              "List of milestones that unlock portions of the airdrop"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "milestone"
                }
              }
            }
          },
          {
            "name": "creationTime",
            "docs": [
              "Creation timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "expirationTime",
            "docs": [
              "Airdrop expiration timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "isActive",
            "docs": [
              "Whether the airdrop is active"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userTokenAirdropClaimedEvent",
      "docs": [
        "Event emitted when airdrop tokens are claimed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenName",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "airdropId",
            "docs": [
              "Airdrop ID"
            ],
            "type": "u8"
          },
          {
            "name": "recipient",
            "docs": [
              "Recipient address"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount claimed"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Claim timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenAirdropCreatedEvent",
      "docs": [
        "Event emitted when a user token airdrop is created"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenName",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "airdropId",
            "docs": [
              "Airdrop ID"
            ],
            "type": "u8"
          },
          {
            "name": "totalAmount",
            "docs": [
              "Total amount allocated"
            ],
            "type": "u64"
          },
          {
            "name": "milestoneCount",
            "docs": [
              "Number of milestones"
            ],
            "type": "u8"
          },
          {
            "name": "expirationTime",
            "docs": [
              "Expiration timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Creation timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenAirdropExpiredEvent",
      "docs": [
        "Event emitted when unclaimed tokens are processed after expiration"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "airdropId",
            "docs": [
              "Airdrop ID"
            ],
            "type": "u8"
          },
          {
            "name": "burnedAmount",
            "docs": [
              "Amount burned (75%)"
            ],
            "type": "u64"
          },
          {
            "name": "buybackAmount",
            "docs": [
              "Amount used for buyback (25%)"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Expiration timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenCreatedEvent",
      "docs": [
        "Event emitted when a user token is created"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "Creator of the token"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "name",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Token symbol"
            ],
            "type": "string"
          },
          {
            "name": "totalSupply",
            "docs": [
              "Total supply of the token"
            ],
            "type": "u64"
          },
          {
            "name": "initialPrice",
            "docs": [
              "Initial price in lamports"
            ],
            "type": "u64"
          },
          {
            "name": "kFactor",
            "docs": [
              "K factor for bonding curve"
            ],
            "type": "u64"
          },
          {
            "name": "airdropReserve",
            "docs": [
              "Amount reserved for airdrops"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of creation"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenMigratedEvent",
      "docs": [
        "Event emitted when a user token is migrated to Raydium"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "name",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Token symbol"
            ],
            "type": "string"
          },
          {
            "name": "authority",
            "docs": [
              "Authority who initiated migration"
            ],
            "type": "pubkey"
          },
          {
            "name": "solAmount",
            "docs": [
              "SOL amount migrated to Raydium pool"
            ],
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Token amount migrated to Raydium pool"
            ],
            "type": "u64"
          },
          {
            "name": "poolAddress",
            "docs": [
              "Raydium pool address"
            ],
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of migration"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenMilestoneVerifiedEvent",
      "docs": [
        "Event emitted when a milestone is verified"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "airdropId",
            "docs": [
              "Airdrop ID"
            ],
            "type": "u8"
          },
          {
            "name": "milestoneIndex",
            "docs": [
              "Milestone index"
            ],
            "type": "u8"
          },
          {
            "name": "description",
            "docs": [
              "Milestone description"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount unlocked"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Verification timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenPriceEvent",
      "docs": [
        "Event emitted when calculating token price"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "supply",
            "docs": [
              "Current supply"
            ],
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Calculated price"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenPurchaseEvent",
      "docs": [
        "Event emitted when tokens are purchased from a user token"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "docs": [
              "Buyer of the tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "Token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenName",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount of SOL provided"
            ],
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Amount of tokens received"
            ],
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Price per token"
            ],
            "type": "u64"
          },
          {
            "name": "platformFee",
            "docs": [
              "Platform fee amount"
            ],
            "type": "u64"
          },
          {
            "name": "referralFee",
            "docs": [
              "Referral fee amount (if applicable)"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Unix timestamp of purchase"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTokenSaleEvent",
      "docs": [
        "Event emitted when tokens are sold from a user token"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seller",
            "docs": [
              "The seller who sold the tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "Mint address of the token"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenName",
            "docs": [
              "Name of the token"
            ],
            "type": "string"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Amount of tokens sold"
            ],
            "type": "u64"
          },
          {
            "name": "solAmount",
            "docs": [
              "SOL amount received"
            ],
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Price at which tokens were sold"
            ],
            "type": "u64"
          },
          {
            "name": "timestamp",
            "docs": [
              "Timestamp of the sale"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ]
};
