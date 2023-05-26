import { Wallet, web3 } from "@project-serum/anchor";
import { getTinjiProgram, getTinjiProvider } from "./config/contractConfig";
import bankSecret from "./secret/my-wallet.json";
import { TinjiContract } from "./modules/tinjiContract";
import { TinjiNft } from "./modules/tinjiNft";

// deposit - 0

async function main() {
  // 0. bank wallet - should be the wallet that deployed smart contract.
  const bankKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(bankSecret));
  const bankWallet = new Wallet(bankKeypair);

  // const bankKeypair = web3.Keypair.generate();
  // const bankWallet = new Wallet(bankKeypair);

  // 1. Provider and Contract Program
  const tinjiProvider = await getTinjiProvider(bankWallet, "https://api.devnet.solana.com");
  const tinjiProgram = await getTinjiProgram(tinjiProvider);

  // airdrop into bankWallet
  // await tinjiProvider.connection.requestAirdrop(bankWallet.publicKey, web3.LAMPORTS_PER_SOL);

  const tinjiContract = new TinjiContract(
    tinjiProvider,
    tinjiProgram,
    bankKeypair
  );

  // 2. create Bank Account and Client Account
  console.log("\n[01. Initialize]");
  const bankAccount = web3.Keypair.generate();
  const clientAccount = web3.Keypair.generate();
  const recommenderAccount = web3.Keypair.generate();
  console.log(`BankWallet Address: ${bankWallet.publicKey.toString()}`);
  console.log(`Client Address: ${clientAccount.publicKey.toString()}`);
  console.log(`recommenderAccount Address: ${recommenderAccount.publicKey.toString()}`);
  console.log(`BankAccount Address: ${bankAccount.publicKey.toString()}`);
  let bankWalletBalance = await tinjiProvider.connection.getBalance(
    bankWallet.publicKey
  );
  let clientBalance = await tinjiProvider.connection.getBalance(
    clientAccount.publicKey
  );
  console.log(`BankWallet Balance: ${bankWalletBalance}`);
  console.log(`Cleint Balance: ${clientBalance}`);

  // 2.5 Initialize
  const tx1 = await tinjiContract.initializeContract(bankAccount);
  console.log(tx1);

  // 3. deposit for nft
  console.log("\n[02. Deposit for a NFT]");
  await tinjiContract.depositForNFT(bankAccount.publicKey);
  await tinjiContract.depositForNFT(bankAccount.publicKey);
  const tx2 = await tinjiContract.depositForNFT(bankAccount.publicKey);
  console.log(tx2);
  bankWalletBalance = await tinjiProvider.connection.getBalance(
    bankWallet.publicKey
  );
  clientBalance = await tinjiProvider.connection.getBalance(
    clientAccount.publicKey
  );
  console.log(`BankWallet Balance: ${bankWalletBalance}`);
  console.log(`Cleint Balance: ${clientBalance}`);

  // 4. withdraw for burned
  console.log("\n[03. Withdraw for Burned]");
  const tx3 = await tinjiContract.withdrawForBurned(
    bankAccount.publicKey,
    clientAccount.publicKey,
    recommenderAccount.publicKey
  );
  console.log(tx3);
  bankWalletBalance = await tinjiProvider.connection.getBalance(
    bankWallet.publicKey
  );
  clientBalance = await tinjiProvider.connection.getBalance(
    clientAccount.publicKey
  );
  console.log(`BankWallet Balance: ${bankWalletBalance}`);
  console.log(`Cleint Balance: ${clientBalance}`);

  // 5. withdraw for Expried
  console.log("\n[04. Withdraw for Expired]");
  const tx5 = await tinjiContract.withdrawForExpired(
    bankAccount.publicKey,
    clientAccount.publicKey,
    recommenderAccount.publicKey
  );
  console.log(tx5);
  bankWalletBalance = await tinjiProvider.connection.getBalance(
    bankWallet.publicKey
  );
  clientBalance = await tinjiProvider.connection.getBalance(
    clientAccount.publicKey
  );
  console.log(`BankWallet Balance: ${bankWalletBalance}`);
  console.log(`Cleint Balance: ${clientBalance}`);

  // 6. withdraw for Verified
  console.log("\n[05. Withdraw for Verified]");
  const tx6 = await tinjiContract.withdrawForVerified(
    bankAccount.publicKey,
    clientAccount.publicKey,
    recommenderAccount.publicKey
  );
  console.log(tx6);
  bankWalletBalance = await tinjiProvider.connection.getBalance(
    bankWallet.publicKey
  );
  clientBalance = await tinjiProvider.connection.getBalance(
    clientAccount.publicKey
  );
  console.log(`BankWallet Balance: ${bankWalletBalance}`);
  console.log(`Cleint Balance: ${clientBalance}`);

  //////////////////////// Tinji NFT

  const tinjiNft = new TinjiNft("https://api.devnet.solana.com", bankKeypair);

  const fileUri = "https://nftstorage.link/ipfs/bafybeigvwcqwdf752vvwggz64nbuuebff4kytug2zzsr75e6vbafmxrzzq";
  const metadataUri = "https://nftstorage.link/ipfs/bafkreibn24kliedp2ka7rigsg5ooty5eagldvlbcwead4dufrvyojf5yoq"


  const genericFile = await tinjiNft.downloadFile(fileUri);
  console.log(genericFile);
  const metadataJson = await tinjiNft.downloadMetadata(metadataUri);
  console.log(metadataJson);


}

main();
