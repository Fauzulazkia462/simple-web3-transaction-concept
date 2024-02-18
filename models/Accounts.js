const fs = require('fs');
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '../public/data/accounts.json');
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

exports.getAll = () => {
    const rawData = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(rawData);

    // Sort the data array in descending order based on a timestamp or another property
    data.sort((a, b) => {
        // Assuming each item has a 'timestamp' property
        return new Date(b.created) - new Date(a.created);
    });

    return data;
}

exports.getAddressBalance = (privateKey) => {
    const rawData = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(rawData);
    
    const address = toHex(secp.getPublicKey(privateKey, true)).slice(-20);
    const account = data.find(account => account.address === address);

    return account;
}

exports.add = (data) => {
    
    const rawData = fs.readFileSync(jsonFilePath);
    const oldData = JSON.parse(rawData);
    
    // generating private Key, public key, and address
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = toHex(secp.getPublicKey(privateKey, true));
    const address = publicKey.slice(-20);

    // inserting the private key, public key, and address to the data object
    data.privateKey = privateKey;
    data.publicKey = publicKey;
    data.address = address;
    data.balance = parseInt(data.balance);
    data.created = new Date().toLocaleString();

    oldData.push(data);
    fs.writeFileSync(jsonFilePath, JSON.stringify(oldData, null, 2));
    return true;
}

exports.delete = (id) => {
    const rawData = fs.readFileSync(jsonFilePath);
    let accounts = JSON.parse(rawData);

    accounts = accounts.filter(account => account.address !== id);
    fs.writeFileSync(jsonFilePath, JSON.stringify(accounts, null, 2));
}