const accountsModel = require('../models/Accounts');
const transactionModel  = require('../models/Transactions');

exports.index = (req, res) => {
    const data = accountsModel.getAll();
    res.render('transaction/index', {data});
};

exports.send = (req, res) => {
    const data = req.body;
    const success = transactionModel.send(data);

    if(success){
        res.redirect('/trx');
    }

    res.send('<script>alert("Please check the account availability, and also the balance!"); window.location="/trx";</script>')
}