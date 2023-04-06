const jwt = require('jsonwebtoken');

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, '***REMOVED***', {
            expiresIn: '1d'
        });
    },

    validateToken: (token) => {
        return jwt.verify(token, '***REMOVED***')
    }
}