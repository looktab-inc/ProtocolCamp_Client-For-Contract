import { Wallet, web3 } from "@project-serum/anchor";
import { getTinjiProgram, getTinjiProvider } from "./config/config";
import bankSecret from "./secret/my-wallet.json";

async function main() {
  // 0. my wallet
  const bankKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(bankSecret));
  const bankWallet = new Wallet(bankKeypair);

  // 1. Provider and Contract Program
  const tinjiProvider = await getTinjiProvider(bankWallet);
  const tinjiProgram = await getTinjiProgram(tinjiProvider);
}

main();
