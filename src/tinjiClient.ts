import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { DepositForNft } from "./idl/deposit_for_nft";

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
    let [pdaAuth, _pdaBump] = web3.PublicKey.findProgramAddressSync(
      [this.PDA_BASE_SEED, bankAccount.publicKey.toBuffer()],
      this.program.programId
    );

    const transaction = await this.program.methods
      .initialize()
      .accounts({
        bankAccount: bankAccount.publicKey,
        pdaAuth: pdaAuth,
        bankAuth: this.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bankAccount, this.bankWallet])
      .rpc();

    return transaction;
  }

  depositForNFT() {}

  withdrawForBurned() {}

  withdrawForExpired() {}

  withdrawForVerified() {}
}
