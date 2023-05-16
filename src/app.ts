import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";
import {  tinjiProvider } from "./config";
import { DepositForNft, IDL } from "./idl/deposit_for_nft";
import { PROGRAM_ID } from "./contract/programId";
import bankSecret from "./secret/my-wallet.json";




async function main() {

//   const tinjiProvider = await getTinjiProvider();
//   const tinjiContract = await getTinjiContract();

//   console.log(`Provider's PubKey : ${tinjiProvider.publicKey}`);
//   console.log(`Program's PubKey : ${tinjiContract.programId}`);
    // const programID = new PublicKey(idl.metadata.address);
  const bankKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(bankSecret));
  const bankWallet = new Wallet(bankKeypair);

  const network = "http://127.0.0.1:8899";
  const connection = new web3.Connection(network, "processed");
 
  const tinjiProvider: AnchorProvider = new AnchorProvider(connection, bankWallet, {
    preflightCommitment: "processed",
  });

  const amount = await tinjiProvider.connection.getBalance(PROGRAM_ID);
  console.log(`test amount: ${amount.toString()}`);

  const idl = await Program.fetchIdl(PROGRAM_ID, tinjiProvider);

  if(idl === null) {
    throw new Error("Failed to fetch IDL");
  }

  const tinjiContract = new Program(
    idl, 
    "GKcWYEKo8ZWKRo82e2Vgd92JwVeqwT5XNfyMmR4j4sfX", 
    tinjiProvider
  );

}

main();
