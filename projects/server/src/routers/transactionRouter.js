const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { tokenVerify } = require('../middleware/Token');
const { uploadPaymentImage } = require('../middleware/upload')

router.get('/get', tokenVerify, transactionController.getTransaction);
router.post('/order', tokenVerify, transactionController.addTransaction);
router.post('/uploadPayment/:transaction_id', tokenVerify, uploadPaymentImage, transactionController.uploadPaymentProof);
router.patch('/cancel', tokenVerify, transactionController.cancelOrder);
router.get('/confirmOrder', tokenVerify, transactionController.confirmOrder);

module.exports = router;