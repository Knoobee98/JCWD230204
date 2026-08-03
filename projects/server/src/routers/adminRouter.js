const express = require('express');
const router = express.Router();
const {adminController} = require('./../controllers');
const { uploadProducts } = require('../middleware/upload');
const { tokenVerify } = require('../middleware/Token');

router.post('/login',adminController.loginsuperadmin)
router.post('/register',adminController.registerbranchadmin)
router.get('/getTransactions', tokenVerify, adminController.getTransactionUser)
router.post('/updateStatus/:id', tokenVerify, adminController.updateTransactionStatus)
router.get('/getProducts', tokenVerify, adminController.getAllProducts)
router.get('/getBranchProducts', tokenVerify, adminController.getBranchProducts)
router.post('/createProduct', tokenVerify, adminController.createProduct)
router.post('/updateProduct', tokenVerify, adminController.updateProduct)
router.post('/deleteProduct', tokenVerify, adminController.deleteProduct)
router.get('/getStockHistory', tokenVerify, adminController.getStockHistory)
router.post('/createDiscount/:admin_id', tokenVerify, adminController.createDiscount)
router.post('/uploadProductImage', tokenVerify, uploadProducts, adminController.uploadProductImage)
router.post('/checkStatus', tokenVerify, adminController.checkStatus)

module.exports = router;