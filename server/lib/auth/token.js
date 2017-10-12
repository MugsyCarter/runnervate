
const jwt = require('jsonwebtoken');
const secret = process.env.APP_SECRET || 'openSesame';

module.exports = {
    assignToken(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user._id,
                role: user.role
            };

            jwt.sign(payload, secret, null, (err, token) => {
                if(err) return reject(err);
                resolve(token);
            });
        });
    },

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, payload) => {
                if(err) return reject(err);
                resolve(payload);
            });
        });
    }
};
