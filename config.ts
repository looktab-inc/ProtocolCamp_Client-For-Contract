import { AnchorProvider, Wallet, web3 } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import bankSecret from "./secret/my-wallet.json";

async function set() {
    
}

const bankKeypair = Keypair.fromSecretKey(Uint8Array.from(bankSecret));

export async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    const bankWallet = new Wallet(bankKeypair);

    const provider = new AnchorProvider(connection, bankWallet, {
        preflightCommitment: "processed",
    });

    return provider;
}