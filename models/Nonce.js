const fs = require('fs').promises;
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '../public/data/nonce.json');

exports.getNonce = async () => {
    const rawData = await fs.readFile(jsonFilePath);
    const data =  JSON.parse(rawData);

    return data.nonce;
}

exports.addNonce = async () => {
    const rawData = await fs.readFile(jsonFilePath);
    const data =  JSON.parse(rawData);

    data.nonce += 1;

    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));

    return data.nonce;
}