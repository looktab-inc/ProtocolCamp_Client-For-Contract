import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";
import bankSecret from "./secret/my-wallet.json";
import { DepositForNft, IDL } from "./idl/deposit_for_nft";
import { PROGRAM_ID, PROGRAM_ID_IDL } from "./contract/programId";

async function set() {}

const bankKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(bankSecret));
const bankWallet = new Wallet(bankKeypair);

const network = "http://127.0.0.1:8899";
const connection = new web3.Connection(network, "processed");

export const tinjiProvider: AnchorProvider = new AnchorProvider(connection, bankWallet, {
    preflightCommitment: "processed",
});

// export const tinjiContract: Program<DepositForNft> = new Program<DepositForNft>(IDL, PROGRAM_ID, tinjiProvider);

// export async function getTinjiProvider(): Promise<AnchorProvider> {
//   const network = "http://127.0.0.1:8899";
//   const connection = new Connection(network, "processed");

//   const bankWallet = new Wallet(bankKeypair);

//   const tinjiProvider = new AnchorProvider(connection, bankWallet, {
//     preflightCommitment: "processed",
//   });

//   return tinjiProvider;
// }

// export async function getTinjiContract(): Promise<Program<DepositForNft>> {
//   const tinjiContract: Program<DepositForNft> = new Program<DepositForNft>(
//     IDL, 
//     PROGRAM_ID, 
//     await getTinjiProvider()
//   );

//   return tinjiContract;
// }
