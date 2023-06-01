# ProtocolCamp_Client-For-Contract
Client for Tinji Smart Contract written using typescript.  
The Client has TinjiContract and TinjiNft Class.  
You can clone and run `src/app.ts` using ts-node. But you should check hardcoded parts and change codes.  
There is no secret file in this repo so you should add your own secret file into the project.  

## TinjiContract
TinjiContract Class communicates with Tinji Smart Contract.
- initializeContract
- depositForNFT
- withdrawForBurned
- withdrawForExpired
- withdrawForVerified
- getPdaAuthPubkey
- getSolVaultPubkey

## TinjiNft
TinjiNft Class communicates with Metaplex to mint NFT using Umi Library.
- uploadFile
- uploadMetadata
- downloadFile
- downloadMetadata
- mintNft
- getNftMetadata
- updateNftMetadata
- burnNft
- generateSignerKeypair
