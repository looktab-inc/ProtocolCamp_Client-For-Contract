import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { DepositForNft } from "../idl/deposit_for_nft";
import { BankAccount } from "../contract/accounts";

export class TinjiContract {
  readonly provider: AnchorProvider;
  readonly program: Program<DepositForNft>;
  private bankWallet: web3.Keypair;

  readonly PDA_BASE_SEED: Uint8Array =
    anchor.utils.bytes.utf8.encode("pda-auth");
  readonly SOL_VAULT_BASE_SEED: Uint8Array =
    anchor.utils.bytes.utf8.encode("sol-vault");

  constructor(
    provider: AnchorProvider,
    program: Program<DepositForNft>,
    bankWallet: web3.Keypair
  ) {
    this.provider = provider;
    this.program = program;
    this.bankWallet = bankWallet;
  }

  async initializeContract(bankAccount: web3.Keypair): Promise<string> {
    const pdaAuthPubkey = this.getPdaAuthPubkey(bankAccount.publicKey);

    const transaction = await this.program.methods
      .initialize()
      .accounts({
        bankAuth: this.bankWallet.publicKey,
        bankAccount: bankAccount.publicKey,
        pdaAuth: pdaAuthPubkey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bankAccount, this.bankWallet])
      .rpc();

    return transaction;
  }

  // Deposit 0.01 SOl
  async depositForNFT(bankAccount: web3.Keypair): Promise<string> {
    const pdaAuthPubkey = this.getPdaAuthPubkey(bankAccount.publicKey);
    const solVaultPubkey = this.getSolVaultPubkey(pdaAuthPubkey);

    const transaction = await this.program.methods
      .depositForNft()
      .accounts({
        bankAuth: this.bankWallet.publicKey,
        bankAccount: bankAccount.publicKey,
        pdaAuth: pdaAuthPubkey,
        solVault: solVaultPubkey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([this.bankWallet])
      .rpc();

    return transaction;
  }

  // bank: 0.009, client: 0.001
  async withdrawForBurned(
    bankAccount: web3.Keypair,
    clientAddress: web3.PublicKey
  ): Promise<string> {
    const pdaAuthPubKey = this.getPdaAuthPubkey(bankAccount.publicKey);
    const solVaultPubkey = this.getSolVaultPubkey(pdaAuthPubKey);

    const transaction = await this.program.methods
      .withdrawForBurned()
      .accounts({
        bankAuth: this.bankWallet.publicKey,
        bankAccount: bankAccount.publicKey,
        pdaAuth: pdaAuthPubKey,
        solVault: solVaultPubkey,
        systemProgram: web3.SystemProgram.programId,
        clientAccount: clientAddress,
      })
      .signers([this.bankWallet])
      .rpc();

    return transaction;
  }

  // bank: 0.01, client: 0
  async withdrawForExpired(
    bankAccount: web3.Keypair,
    clientAddress: web3.PublicKey
  ): Promise<string> {
    const pdaAuthPubKey = this.getPdaAuthPubkey(bankAccount.publicKey);
    const solVaultPubkey = this.getSolVaultPubkey(pdaAuthPubKey);

    const transaction = await this.program.methods
      .withdrawForExpired()
      .accounts({
        bankAuth: this.bankWallet.publicKey,
        bankAccount: bankAccount.publicKey,
        pdaAuth: pdaAuthPubKey,
        solVault: solVaultPubkey,
        systemProgram: web3.SystemProgram.programId,
        clientAccount: clientAddress,
      })
      .signers([this.bankWallet])
      .rpc();

    return transaction;
  }

  // bank: 0.001, client: 0.009
  async withdrawForVerified(): Promise<string> {
    const transaction = "";

    return transaction;
  }

  private getPdaAuthPubkey(bankAccountPubkey: web3.PublicKey): web3.PublicKey {
    let [pdaAuthPubKey, _pdaBump] = web3.PublicKey.findProgramAddressSync(
      [this.PDA_BASE_SEED, bankAccountPubkey.toBuffer()],
      this.program.programId
    );
    return pdaAuthPubKey;
  }

  private getSolVaultPubkey(pdaAuthPubkey: web3.PublicKey): web3.PublicKey {
    let [solVaultPubkey, _solVaultBump] = web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("sol-vault"), pdaAuthPubkey.toBuffer()],
      this.program.programId
    );
    return solVaultPubkey;
  }
}
