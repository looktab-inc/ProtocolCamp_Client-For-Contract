import { getProvider } from "./config";

async function main() {
  const provider = await getProvider();
  console.log(`PubKey : ${provider.publicKey}`);
}

main();
