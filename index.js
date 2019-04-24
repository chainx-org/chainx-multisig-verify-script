const bitcoin = require("bitcoinjs-lib");
const fetch = require("node-fetch");

const { privateKey, multisigAddress, redeemScriptHex, toSignRawTransactionHex, fee } = require("./config")
const redeemScript = Buffer.from(redeemScriptHex, "hex");

const network = bitcoin.networks.testnet;

async function getUnspentsFromApi(address) {
  const url = `https://api.chainx.org/bitx/testnet/${address}/utxos`;
  const res = await fetch(url);
  const utxos = await res.json();
  return utxos.map(utxo => ({
    txid: utxo.mintTxid,
    vout: utxo.mintIndex,
    amount: utxo.value
  }));
}

async function compose() {
  let txb;
  if (toSignRawTransactionHex) {
    txb = bitcoin.TransactionBuilder.fromTransaction(
      bitcoin.Transaction.fromHex(rawTx),
      network
    );
  } else {
    txb = new bitcoin.TransactionBuilder(network);
    const allUnspents = await getUnspentsFromApi(multisigAddress);
    const targetUnspent = allUnspents.find(utxo => utxo.amount > fee);
    if (!targetUnspent) {
      throw new Error(
        `${multisigAddress} has no utxo whose amount is greater than 10000 satoshi`
      );
    }

    txb.addInput(targetUnspent.txid, targetUnspent.vout);
    const change = targetUnspent.amount - fee;
    txb.addOutput(multisigAddress, change);
  }

  const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
  txb.sign(0, keyPair, redeemScript);

  let rawTransaction;

  try {
    rawTransaction = txb.build().toHex();
    console.log("Following transaction is fully signed:")
  } catch (e) {
    rawTransaction = txb.buildIncomplete().toHex();
    console.log("Broadcast the following raw transaction hex to others who haven't sign it:");
  }

  console.log(rawTransaction);
}

compose();
