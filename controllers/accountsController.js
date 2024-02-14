const accountsModel = require('../models/Accounts');

exports.index = (req, res) => {
    const data = accountsModel.getAll();
    res.render('home/index', {data});
};

exports.add = (req, res) => {
    const newData = req.body;
    const success = accountsModel.add(newData);

    if(success){
        res.redirect('/');
    }

    res.send('<script>alert("Address already exists!"); window.location="/";</script>');
};

exports.delete = (req, res) => {
    const id = req.body.id;
    accountsModel.delete(id);
    res.redirect('/');
}

