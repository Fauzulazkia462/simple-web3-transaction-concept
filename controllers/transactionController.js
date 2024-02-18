const accountsModel = require('../models/Accounts');
const transactionModel  = require('../models/Transactions');
const nonceModel = require('../models/Nonce');
const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


exports.index = (req, res) => {
    const data = accountsModel.getAll();
    const trxData = transactionModel.getData();
    res.render('transaction/index', {data, trxData});
}

exports.getBalanceAddress = (req, res) => {
    const privateKey = req.body.privateKey;
    const data = accountsModel.getAddressBalance(privateKey);

    res.json(data);
}

exports.send = async (req, res) => {
    const nonce = await nonceModel.getNonce();
    const fromAddress = req.body.fromAddress;
    const privateKey = req.body.fromPrivatekey[0];
    const toAddress = req.body.toAddress;
    const amount = parseInt(req.body.amount);

    // hashing the reccepeint, amount, and nonce
    const msgHash = keccak256(utf8ToBytes(toAddress + amount + JSON.stringify(nonce)));

    // signing the trx
    const signTxn = await secp.sign(msgHash, privateKey, { recovered: true });

    // sending the balance using trx model
    const success = await transactionModel.send(nonce, fromAddress, toAddress, amount, signTxn);

    if(!success){
        res.send("Error sending");
    }

    // inserting trx data
    await transactionModel.dataTrx(amount, fromAddress, toAddress, nonce);

    // runnnign the addNonce funcion from model of nonce
    await nonceModel.addNonce();

    res.redirect('/trx');

}