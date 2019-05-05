const bitcoin = require("bitcoinjs-lib");

const network = bitcoin.networks.testnet;
async function generate() {
  const keyPair = bitcoin.ECPair.makeRandom({ network, compressed: true });
  const wif = keyPair.toWIF();
  const pubkey = Buffer.from(keyPair.publicKey).toString("hex");
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network
  });
  console.log(`private key(WIF): ${wif}`);
  console.log(`public key: ${pubkey}`);
  console.log(`address: ${address}`);
}

generate();
