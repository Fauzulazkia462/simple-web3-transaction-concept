const fs = require('fs');
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '../public/data/accounts.json');

exports.send = (data) => {
    const rawData = fs.readFileSync(jsonFilePath);
    const oldData = JSON.parse(rawData);

    const amount = parseInt(data.amount);
    const toAddress = data.toAddress;
    const fromAddress = data.fromAddress;

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

    fs.writeFileSync(jsonFilePath, JSON.stringify(oldData, null, 2));
    return true;
}