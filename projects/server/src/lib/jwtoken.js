const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1d'
        });
    },

    validateToken: (token) => {
        return jwt.verify(token, JWT_SECRET)
    }
}