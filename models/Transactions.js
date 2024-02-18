const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '../public/data/accounts.json');
const jsontrxFilePath = path.resolve(__dirname, '../public/data/transaction.json');
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

exports.getData = () => {
    const rawData = fs.readFileSync(jsontrxFilePath);
    const data = JSON.parse(rawData);

    // Sort the data array in descending order based on a timestamp or another property
    data.sort((a, b) => {
        // Assuming each item has a 'timestamp' property
        return new Date(b.time) - new Date(a.time);
    });

    return data;
}

exports.send = async (nonce, fromAddress, toAddress, amount, signTxn) => {
    const rawData = await fsp.readFile(jsonFilePath);
    const oldData = JSON.parse(rawData);

    // retrieve signature and recovery bit
    const [signature, recoveryBit] = signTxn;

    // convert signature to Uint8Array
    const formattedSignature = Uint8Array.from(Object.values(signature));

    //message hash
    const msgToBytes = utf8ToBytes(toAddress + amount + JSON.stringify(nonce));
    const msgHash = toHex(keccak256(msgToBytes));

    // recover public key
    const publicKey = await secp.recoverPublicKey(msgHash, formattedSignature, recoveryBit);

    // verify transection 
    const verifyTx = secp.verify(formattedSignature, msgHash, publicKey);

    if (!verifyTx) {
        return false;
    }

    const senderAccount = oldData.find(account => account.address === fromAddress);
    if (!senderAccount) {
        console.error(`Sender's account (${fromAddress}) not found.`);
        return false;
    }

    // Check if the sender has enough balance
    if (senderAccount.balance < amount) {
        console.error(`Insufficient balance: Sender's balance (${senderAccount.balance}) is less than the requested amount (${amount}).`);
        return false;
    }

    const recipientAccount = oldData.find(account => account.address === toAddress);
    if (!recipientAccount) {
        console.error(`Recipient's account (${toAddress}) not found.`);
        return false;
    }

    if (senderAccount === recipientAccount) {
        console.error(`Recipient and sender cannot be the same`);
        return false;
    }

    // Update sender's balance
    senderAccount.balance -= amount;

    // Update recipient's balance
    recipientAccount.balance += amount;

    await fs.writeFile(jsonFilePath, JSON.stringify(oldData, null, 2));
    return true;
}

exports.dataTrx = async (amount, fromAddress, toAddress, nonce) => {
    const rawData = await fs.readFile(jsontrxFilePath);
    const oldData = JSON.parse(rawData);

    const newData = {};
    newData.time = new Date().toLocaleString();
    newData.amount = amount;
    newData.fromAddress = fromAddress;
    newData.toAddress = toAddress;
    newData.nonce = nonce;

    oldData.push(newData);
    await fsp.writeFile(jsontrxFilePath, JSON.stringify(oldData, null, 2));
    return oldData;
}