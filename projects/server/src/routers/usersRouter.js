const express = require('express');
const router = express.Router();
const {usersController} = require('./../controllers');
const { tokenVerify } = require('../middleware/Token');
const { uploadProfilePicture } = require('../middleware/upload');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/keep-login', tokenVerify);
router.patch('/activation/:id', usersController.activation);
router.post('/forgot-password', usersController.forgotPassword);
router.patch('/resetPassword/:id', usersController.resetPassword);
router.patch('/change-password', tokenVerify, usersController.changePassword);
router.patch('/update', usersController.updateProfile);
router.patch('/updateProfile/:id', usersController.updateProfile);
router.get('/profile', tokenVerify, usersController.getProfile);
router.patch('/uploadProfilePicture', tokenVerify, uploadProfilePicture, usersController.uploadProfilePicture);

module.exports = router;