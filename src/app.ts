import { Wallet, web3 } from "@project-serum/anchor";
import { getTinjiProgram, getTinjiProvider } from "./config/config";
import bankSecret from "./secret/my-wallet.json";
import { TinjiContract } from "./modules/tinjiClient";

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
  console.log("\n[01. Initialize]");
  const bankAccount = web3.Keypair.generate();
  const tx1 = await tinjiContract.initializeContract(bankAccount);
  console.log(tx1);

  // 3. deposit for nft
  console.log("\n[02. Deposit for a NFT]");
  const tx2 = await tinjiContract.depositForNFT(bankAccount);
  console.log(tx2);

  // 4. withdraw for burned
  console.log("\n[03. Withdraw for Burned]");
  const clientAccount = web3.Keypair.generate();
  const tx3 = await tinjiContract.withdrawForBurned(
    bankAccount,
    clientAccount.publicKey
  );
  console.log(tx3);
  console.log(`BankWallet Address: ${bankWallet.publicKey.toString()}`);
  console.log(`Client Address: ${clientAccount.publicKey.toString()}`);
}

main();
