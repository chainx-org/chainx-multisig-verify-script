const bitcoin = require("bitcoinjs-lib");
const fetch = require("node-fetch");

const { privateKey, multisigAddress, redeemScriptHex, toSignRawTransactionHex, fee, amount, targetAddress} = require("./config")
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
      bitcoin.Transaction.fromHex(toSignRawTransactionHex),
      network
    );
  } else {
    txb = new bitcoin.TransactionBuilder(network);
    txb.setVersion(1);

    const allUnspents = await getUnspentsFromApi(multisigAddress);
    const targetUnspent = allUnspents.find(utxo => utxo.amount > fee + amount);
    if (!targetUnspent) {
      throw new Error(
        `${multisigAddress} has no utxo whose amount is greater than 10000 satoshi`
      );
    }

    txb.addInput(targetUnspent.txid, targetUnspent.vout);
    const change = targetUnspent.amount - fee - amount;
    txb.addOutput(targetAddress, amount);
	if (change > 0) {
		txb.addOutput(multisigAddress, change);
	}
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
