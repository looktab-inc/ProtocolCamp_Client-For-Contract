import * as umilib from "@metaplex-foundation/umi";
import { Umi, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
import { web3 } from "@project-serum/anchor";
import { signerIdentity } from "@metaplex-foundation/umi";


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


}
