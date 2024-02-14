const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const transactionController = require('../controllers/transactionController');

router.get('/', accountsController.index);
router.post('/add', accountsController.add);
router.post('/delete', accountsController.delete);

router.get('/trx', transactionController.index);
router.post('/send', transactionController.send);

module.exports = router;