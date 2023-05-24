import * as umilib from "@metaplex-foundation/umi";
import { Umi, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mintV2, mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
import { web3 } from "@project-serum/anchor";
import { signerIdentity } from "@metaplex-foundation/umi";
import { generateSigner } from "@metaplex-foundation/umi";
import { transactionBuilder } from "@metaplex-foundation/umi";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-essentials";
import { TinjiContract } from "./tinjiContract";
import { getTinjiProgram, getTinjiProvider } from "../config/config";


export class TinjiNft {
    private umi: Umi;
    readonly bankWallet: web3.Keypair;
    
    constructor(
        network: string,
        bankWallet: web3.Keypair
    ) {
        this.umi = this.initUmi(network);
        this.bankWallet = bankWallet;
        
        const umiKeypair = {
            publicKey: umilib.publicKey(bankWallet.publicKey),
            secretKey: new Uint8Array(bankWallet.secretKey),
        }
        const umiSigner = createSignerFromKeypair(this.umi, umiKeypair);

        this.umi.use(signerIdentity(umiSigner));
    }

    private initUmi(network: string): Umi {
        return createUmi(network)
          .use(mplCandyMachine())
          .use(nftStorageUploader());
    }

    async mintNft(
        candyMachineAddress: umilib.PublicKey,
        collectionNftAddress: umilib.PublicKey,
        bankAccountAddress: web3.PublicKey,
    ): Promise<umilib.PublicKey | null> {
        const nftMint = generateSigner(this.umi);

        // mint NFT from CandyMachine.
        const txResult = await transactionBuilder()
            .add(setComputeUnitLimit(this.umi, { units: 800_000 }))
            .add(
                mintV2(this.umi, {
                  candyMachine: candyMachineAddress,
                  nftMint: nftMint,
                  collectionMint: collectionNftAddress,
                  collectionUpdateAuthority: this.umi.identity.publicKey,
                })
            ).sendAndConfirm(this.umi);
        
        // TODO : Deposit Sol into Tinji Contract.
        const tinjiProvider = await getTinjiProvider(this.bankWallet, "http://127.0.0.1:8899");
        const tinjiProgram = await getTinjiProgram(tinjiProvider);
        const tinjiContract = new TinjiContract(tinjiProvider, tinjiProgram, this.bankWallet);

        const txSignature = await tinjiContract.depositForNFT(bankAccountAddress);

        console.log(txSignature);
        
        // console.log(txResult);
        if (txResult.result.value.err == null) {
            return nftMint.publicKey;
        } else {
            return null;
        }
    }


}
