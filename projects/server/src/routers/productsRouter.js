const express = require('express');
const router = express.Router();
const { productsController } = require('../controllers');
const { tokenVerify } = require('../middleware/Token');


router.get('/get', productsController.getAllProducts);
router.get('/getDetail', productsController.getProductDetail);
router.get('/getCat', productsController.getCategory);
router.get('/getPromo', productsController.getPromo);
router.get('/getNewProduct', productsController.getNewProducts);
router.get('/getRecommended', productsController.getRecommendedProducts);
router.get('/add', tokenVerify, productsController.addToCart);
router.get('/Cart', tokenVerify, productsController.getCart);
router.delete('/Cart/delete', tokenVerify, productsController.removeFromCart);
router.get('/update', tokenVerify, productsController.updateCart);

module.exports = router;