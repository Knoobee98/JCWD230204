const nodemailer = require('nodemailer')
// belum jalan nich
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email@example.com',
        pass: '***REMOVED***'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter