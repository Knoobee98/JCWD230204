const axios = require("axios");
const opencageClient = require("opencage-api-client");
const ip = require("ip");
const reqIp = require("request-ip");
require("dotenv").config();

module.exports = {
  searchPlace: async (req, res) => {
    // const {q} = req.query

    try {
      const key = process.env.OPENCAGE_API_KEY;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${req.query.search}&key=${key}`
      );
      res.status(200).send({
        isError: false,
        message: "search place success",
        data: response.data.results[0].geometry,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: "search place failed",
        data: error.message,
      });
    }
  },

  getUserLocation: async (req, res) => {
    try {
      const key = process.env.OPENCAGE_API_KEY;
      const clientIp = reqIp.getClientIp(req);
      const clientIp2 = ip.address();
      const response = await opencageClient.geocode({
        q: clientIp,
        key: key,
      });
      res.status(200).send({
        isError: false,
        message: "get user location success",
        data: response.results[0],
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: "get user location failed",
        data: error.message,
      });
    }
  },

  getDistance: async(req, res) => {
    try {
        
    } catch (error) {
        
    }
  }
};
