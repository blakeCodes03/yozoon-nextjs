export type Yozoon = {
  version: "0.1.0";
  name: "yozoon";
  instructions: [
    {
      name: "createToken";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "decimals";
          type: "u8";
        },
        {
          name: "initialSupply";
          type: "u64";
        }
      ];
    },
    {
      name: "buyToken";
      accounts: [/* add your account metadata here */];
      args: [/* your arguments here */];
    },
    {
      name: "sellToken";
      accounts: [/* add your account metadata here */];
      args: [/* your arguments here */];
    }
  ];
};
