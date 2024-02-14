const fs = require('fs');
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '../public/data/accounts.json');

exports.getAll = () => {
    const rawData = fs.readFileSync(jsonFilePath);
    return JSON.parse(rawData);
}

exports.add = (data) => {
    const rawData = fs.readFileSync(jsonFilePath);
    const accounts = JSON.parse(rawData);
    const existingAddress = accounts.find(account => account.address === data.address);

    // Check if the address already exists
    if (existingAddress) {
        return false;
    }
    data.balance = parseInt(data.balance);
    accounts.push(data);
    fs.writeFileSync(jsonFilePath, JSON.stringify(accounts, null, 2));
    return true;
};

exports.delete = (id) => {
    const rawData = fs.readFileSync(jsonFilePath);
    let accounts = JSON.parse(rawData);

    accounts = accounts.filter(account => account.address !== id);
    fs.writeFileSync(jsonFilePath, JSON.stringify(accounts, null, 2));
}