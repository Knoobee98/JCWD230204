const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-only-change-me');

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
}

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1d'
        });
    },

    createResetToken: (payload) => {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });
    },

    validateToken: (token) => {
        return jwt.verify(token, JWT_SECRET)
    }
}