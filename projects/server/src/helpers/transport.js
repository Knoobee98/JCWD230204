const nodemailer = require('nodemailer')
const dns = require('dns')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    lookup: (hostname, options, callback) => dns.lookup(hostname, { ...options, family: 4 }, callback)
})

module.exports = transporter
