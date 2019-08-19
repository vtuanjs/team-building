const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const secretString = "secret string"

module.exports.required = (req, res, next) => {
    let tokenKey = req.headers['x-access-token']
    try {
        jwt.verify(tokenKey, secretString, (err, decodedJson) => {
            if (err) throw "Wrong token"
            if (Date.now() / 1000 > decodedJson.exp) {
                throw "Token expire, please login again"
            }
            User.findById(decodedJson.id, (err, user) => {
                if (!user) {
                    throw "Can not find user with this token"
                }
                if (user.isBanned === 1) {
                    throw "User is blocked"
                }
                req.user = user
                return next()
            })
        })
    } catch (error) {
        next("Token error: " + error)
    }
}