const express = require('express');
const router = express.Router();

const rajaOngkirAPI = require('../controllers/rajaOngkirAPI');

router.get('/api/city', rajaOngkirAPI.getCity);
router.get('/api/province', rajaOngkirAPI.getState);
router.post('/api/ongkir', rajaOngkirAPI.getOngkir);

module.exports = router