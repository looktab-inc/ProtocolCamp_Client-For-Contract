import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";
import bankSecret from "../secret/my-wallet.json";
import { DepositForNft, IDL } from "../idl/deposit_for_nft";
import { PROGRAM_ID } from "../contract/programId";
import { Connection } from "@solana/web3.js";

export async function getTinjiProvider(
  wallet: Wallet
): Promise<AnchorProvider> {
  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, "processed");

  const tinjiProvider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  return tinjiProvider;
}

export async function getTinjiProgram(
  provider: AnchorProvider
): Promise<Program<DepositForNft>> {
  const tinjiContract: Program<DepositForNft> = new Program<DepositForNft>(
    IDL,
    PROGRAM_ID,
    provider
  );

  return tinjiContract;
}
