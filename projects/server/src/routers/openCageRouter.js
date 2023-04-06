const express = require('express');
const router = express.Router();
const {openCageAPI} = require('./../controllers');

router.get('/search', openCageAPI.searchPlace)
router.get('/userLocation', openCageAPI.getUserLocation)

module.exports = router;