const express = require('express');
const router = express.Router();
const {adminController} = require('./../controllers');
const { uploadProducts } = require('../middleware/upload');
const { tokenVerify } = require('../middleware/Token');

router.post('/login',adminController.loginsuperadmin)
router.post('/register',adminController.registerbranchadmin)
router.get('/getTransactions', adminController.getTransactionUser)
router.post('/updateStatus/:id', adminController.updateTransactionStatus)
router.get('/getProducts', adminController.getAllProducts)
router.get('/getBranchProducts', adminController.getBranchProducts)
router.post('/createProduct',adminController.createProduct)
router.post('/updateProduct',adminController.updateProduct)
router.post('/deleteProduct',adminController.deleteProduct)
router.get('/getStockHistory',adminController.getStockHistory)
router.post('/createDiscount/:admin_id',adminController.createDiscount)
router.post('/uploadProductImage', uploadProducts, adminController.uploadProductImage)
router.post('/checkStatus', tokenVerify, adminController.checkStatus)

module.exports = router;