import * as umilib from "@metaplex-foundation/umi";
import { Umi, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
import { web3 } from "@project-serum/anchor";
import { signerIdentity } from "@metaplex-foundation/umi";
import { generateSigner } from "@metaplex-foundation/umi";
import * as mplMetadata from "@metaplex-foundation/mpl-token-metadata";

export class TinjiNft {
  private umi: Umi;
  readonly bankKeypair: web3.Keypair;
  readonly endpoint: string;

  constructor(network: string, bankKeypair: web3.Keypair) {
    this.umi = this.initUmi(network);
    this.bankKeypair = bankKeypair;
    this.endpoint = network;

    const umiKeypair = {
      publicKey: umilib.publicKey(bankKeypair.publicKey),
      secretKey: new Uint8Array(bankKeypair.secretKey),
    };
    const umiSigner = createSignerFromKeypair(this.umi, umiKeypair);

    this.umi.use(signerIdentity(umiSigner));
  }

  private initUmi(network: string): Umi {
    return createUmi(network)
      .use(mplCandyMachine())
      .use(nftStorageUploader());
  }

  // 현재 CandyMachine 이용하면 구조가 훨씬 복잡해질 것으로 판단하에 주석 처리.
  // async mintNft(
  //     candyMachineAddress: umilib.PublicKey,
  //     collectionNftAddress: umilib.PublicKey,
  //     // bankAccountAddress: web3.PublicKey,
  // ): Promise<umilib.PublicKey | null> {
  //     const nftMint = generateSigner(this.umi);

  //     // mint NFT from CandyMachine.
  //     const txResult = await transactionBuilder()
  //         .add(setComputeUnitLimit(this.umi, { units: 800_000 }))
  //         .add(
  //             mintV2(this.umi, {
  //               candyMachine: candyMachineAddress,
  //               nftMint: nftMint,
  //               collectionMint: collectionNftAddress,
  //               collectionUpdateAuthority: this.umi.identity.publicKey,
  //             })
  //         ).sendAndConfirm(this.umi);

  //     console.log(txResult);
  //     if (txResult.result.value.err == null) {
  //         return nftMint.publicKey;
  //     } else {
  //         return null;
  //     }
  // }

  async uploadFile(
    fileContent: string | Uint8Array,
    fileName: string
  ): Promise<string> {
    const genericFile = umilib.createGenericFile(fileContent, fileName);
    const [fileUri] = await this.umi.uploader.upload([genericFile]);

    return fileUri;
  }

  async uploadMetadata(
    fileUri: (string | null)[],
    metadataName: string
  ): Promise<string> {
    const metadataUri = await this.umi.uploader.uploadJson({
      name: "Tinji" + metadataName,
      description: "Metadata for store NFT minted from Tinji",
      image: fileUri,
    });

    return metadataUri;
  }

  async downloadFile(
    fileUri: string
  ): Promise<umilib.GenericFile> {
    const [file] = await this.umi.downloader.download([fileUri]);
    return file;
  }

  async downloadMetadata(
    metadataUri: string
  ) {
    const metadataJson = await this.umi.downloader.downloadJson(metadataUri);
    return metadataJson;
  }

  async mintNft(
    // updateSigner: umilib.KeypairSigner,
    metadataUri: string
  ): Promise<umilib.KeypairSigner> {
    const mintSigner = generateSigner(this.umi);

    const txResult = await mplMetadata.createNft(this.umi, {
      mint: mintSigner,
      // authority: updateSigner,
      authority: this.umi.identity,
      name: "Store NFT minted from Tinji",
      uri: metadataUri,
      sellerFeeBasisPoints: umilib.percentAmount(9.99, 2),
    }).sendAndConfirm(this.umi);

    return mintSigner;
  }

  async getNftMetadata(
    nftAddress: umilib.PublicKey
  ): Promise<mplMetadata.Metadata> {
    const metadata = await mplMetadata.fetchMetadataFromSeeds(this.umi, {
      mint: nftAddress,
    });

    return metadata;
  }

  async updateNftMetadata(
    // updateAuth: umilib.KeypairSigner,
    nftAddress: umilib.PublicKey,
    originMetaData: mplMetadata.Metadata,
    name: string,
  ) {
    // const tempUmi = createUmi(this.endpoint).use(signerIdentity(updateAuth));

    const transactionBuilder = await mplMetadata.updateV1(this.umi, {
      mint: nftAddress,
      data: umilib.some({ ...originMetaData, name: name})
    }).sendAndConfirm(this.umi);

    // const transaction = transactionBuilder.buildWithLatestBlockhash();
    
    // updateAuth.signTransaction(transaction);

    // this.umi.rpc.sendTransaction(transaction);

    // await mplMetadata.updateV1(this.umi, {
    //   mint: nftAddress,
    //   data: umilib.some({ ...originMetaData, verified: verified})
    // }).
    // }).sendAndConfirm(this.umi);
  }

  async burnNft(
    ownerKeypair: web3.Keypair,
    mintPubkey: umilib.PublicKey
  ) {
    const ownerUmiKeypair = {
      publicKey: umilib.publicKey(ownerKeypair.publicKey),
      secretKey: new Uint8Array(ownerKeypair.secretKey),
    };
    const ownerSigner = createSignerFromKeypair(this.umi, ownerUmiKeypair);

    const txResult = await mplMetadata.burnV1(this.umi, {
      mint: mintPubkey,
      authority: ownerSigner,
      tokenOwner: ownerSigner.publicKey,
      tokenStandard: mplMetadata.TokenStandard.NonFungible
    }).sendAndConfirm(this.umi);

    return txResult;
  }

  generateSignerKeypair(
    keypair: web3.Keypair
  ): umilib.KeypairSigner {

    const umiKeypair = {
        publicKey: umilib.publicKey(keypair.publicKey),
        secretKey: keypair.secretKey,
    }
    const umiKeypairSigner = createSignerFromKeypair(this.umi, umiKeypair);

    return umiKeypairSigner;
  }
}
