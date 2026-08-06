const axios = require('axios');
require('dotenv').config();

module.exports = {
    getCity: async(req,res) => {
        try {
            const response = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: {
                    key: process.env.RAJAONGKIR_API_KEY,
                }
            })

            res.status(200).send({
                isError: false,
                message: 'get city success',
                data: response.data.rajaongkir.results
            })
        } catch (error) {
            console.error("rajaOngkir getCity error:", error)
            res.status(404).send({
                isError: true,
                message: 'get city failed',
                data: null
            })
        }
    },

    getState: async(req, res) => {
        try {
            const response = await axios.get('https://api.rajaongkir.com/starter/province', {
                headers: {
                    key: process.env.RAJAONGKIR_API_KEY,
                }
            })

            res.status(200).send({
                isError: false,
                message: 'get state success',
                data: response.data.rajaongkir.results
            })

        } catch (error) {
            console.error("rajaOngkir getState error:", error)
            res.status(400).send({
                isError: true,
                message: 'get state failed',
                data: null
            })
        }
        
    },

    getOngkir: async(req,res) => {
        const {origin, destination, weight, courier} = req.body
        try {
            if (!origin || !destination || !weight || !courier) {
                return res.status(400).send({
                    isError: true,
                    message: 'origin, destination, weight and courier are required',
                    data: null
                })
            }

            const response = await axios.post('https://api.rajaongkir.com/starter/cost',{
                origin, destination,weight,courier
            }, {
            headers: {
                    'key': process.env.RAJAONGKIR_API_KEY,
                }
            }, )

            res.status(200).send({
                isError: false,
                message: 'get ongkir success',
                data: response.data.rajaongkir.results
            })

        } catch (error) {
            console.error("rajaOngkir getOngkir error:", error)
            res.status(404).send({
                isError: true,
                message: 'get ongkir failed',
                data: null
            })
        }
        

    }
}