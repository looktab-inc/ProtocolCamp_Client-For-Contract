import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";


export class TinjiNft {
    private umi: Umi;
    
    constructor(
        network: string
    ) {
        this.umi = this.initUmi(network);
    }

    initUmi(network: string): Umi {
        return createUmi(network)
          .use(mplCandyMachine())
          .use(nftStorageUploader());
    }
}
