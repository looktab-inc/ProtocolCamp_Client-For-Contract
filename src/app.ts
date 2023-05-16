import { Wallet, web3 } from "@project-serum/anchor";
import { getTinjiProgram, getTinjiProvider } from "./config/config";
import bankSecret from "./secret/my-wallet.json";
import { TinjiContract } from "./tinjiClient";

async function main() {
  // 0. my wallet
  const bankKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(bankSecret));
  const bankWallet = new Wallet(bankKeypair);

  // 1. Provider and Contract Program
  const tinjiProvider = await getTinjiProvider(bankWallet);
  const tinjiProgram = await getTinjiProgram(tinjiProvider);

  const tinjiContract = new TinjiContract(
    tinjiProvider,
    tinjiProgram,
    bankKeypair
  );

  // 2. create Bank Account and Initialize
  const bankAccount = web3.Keypair.generate();
  const tx = await tinjiContract.initializeContract(bankAccount);
  console.log(tx);
}

main();
