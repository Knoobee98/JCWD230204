const express = require('express');
const router = express.Router();
const {adminController} = require('./../controllers');
const { uploadProducts } = require('../middleware/upload');
const { tokenVerify, requireRole } = require('../middleware/Token');

const ADMIN_ROLES = ['super admin', 'branch admin'];

router.post('/login',adminController.loginsuperadmin)
router.post('/register', tokenVerify, requireRole(['super admin']), adminController.registerbranchadmin)
router.get('/getTransactions', tokenVerify, requireRole(ADMIN_ROLES), adminController.getTransactionUser)
router.post('/updateStatus/:id', tokenVerify, requireRole(ADMIN_ROLES), adminController.updateTransactionStatus)
router.get('/getProducts', tokenVerify, requireRole(ADMIN_ROLES), adminController.getAllProducts)
router.get('/getBranchProducts', tokenVerify, requireRole(ADMIN_ROLES), adminController.getBranchProducts)
router.post('/createProduct', tokenVerify, requireRole(ADMIN_ROLES), adminController.createProduct)
router.post('/updateProduct', tokenVerify, requireRole(ADMIN_ROLES), adminController.updateProduct)
router.post('/deleteProduct', tokenVerify, requireRole(ADMIN_ROLES), adminController.deleteProduct)
router.get('/getStockHistory', tokenVerify, requireRole(ADMIN_ROLES), adminController.getStockHistory)
router.post('/createDiscount/:admin_id?', tokenVerify, requireRole(ADMIN_ROLES), adminController.createDiscount)
router.get('/getDiscounts', tokenVerify, requireRole(ADMIN_ROLES), adminController.getDiscounts)
router.post('/uploadProductImage', tokenVerify, requireRole(ADMIN_ROLES), uploadProducts, adminController.uploadProductImage)
router.post('/checkStatus', tokenVerify, requireRole(ADMIN_ROLES), adminController.checkStatus)

module.exports = router;
