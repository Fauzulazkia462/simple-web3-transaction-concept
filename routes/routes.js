const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const transactionController = require('../controllers/transactionController');

router.get('/', homeController.index);
router.post('/add', homeController.add);
router.post('/delete', homeController.delete);

router.get('/trx', transactionController.index);
router.post('/getbalanceaddress', transactionController.getBalanceAddress);
router.post('/send', transactionController.send);

module.exports = router;