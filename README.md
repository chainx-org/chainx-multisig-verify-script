Prerequisite
---

Install `Node.js` and `Yarn`.

Generate private&public key
---
1. Install dependencies: `yarn`.
2. `yarn generate`.

How to run
---

1. Install dependencies: `yarn`.
2. Add configuration: `cat config.example.js > config.js`.
3. Fill necessary fields in the config.js.
4. `yarn build`.

Config clarification
--

* privateKey: your private key(WIF format).
* multisigAddress: the mutisign address generated by ChainX trustee public keys.
* redeemScriptHex: utxo redeem script hex of the muitisig address.
* toSignRawTransactionHex: fill this part if you need to sign the transaction other trustee sent you.
* fee: the transaction fee. 

Generate new btc address
--
```
$ node generate.js
reult:
private key(WIF): cUTeLjQwyEafGsHYrYBXsffp8ghuhvA5CWsSUUXTbhyf8t65kfyz
public key: 0268fe376b3f7ce80593675fe39ab500b869c7b33477727725ec761bc58ee8dfee
address: mqRqtEnygkiUDHH5wXH5Vrb36MJeKGtyzj
```

Sign a transaction
--
The information in config. JS must be filled in correctly！
```
$ node index.js 
Broadcast the following raw transaction hex to others who haven't sign it:
020000000152b4bc95a6dc518fec24932583f311dd5e9779fc8854c511fb0115922c9fd6cd00000000da00483045022100db8cbe5c6be03839ea24e634f58a8523c1c8e3fa5f194876e12a1d94cdc49ce1022072d3705e1958d7d66698761e5ec18d1d573d4bdec945cfe0ade96334b995f956010000004c8b532103f72c448a0e59f48d4adef86cba7b278214cece8e56ef32ba1d179e0a8129bdba210306117a360e5dbe10e1938a047949c25a86c0b0e08a0a7c1e611b97de6b2917dd210311252930af8ba766b9c7a6580d8dc4bbf9b0befd17a8ef7fabac275bba77ae40210227e54b65612152485a812b8856e92f41f64788858466cc4d8df674939a5538c354aeffffffff0158474c00000000001976a914023dbd259dd15fc43da1a758ea7b2bfaec97893488ac00000000
```
