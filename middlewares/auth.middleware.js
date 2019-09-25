const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const secretString = process.env.SECRET_STRING

module.exports.required = async (req, res, next) => {
    let tokenKey = req.headers['x-access-token']
    try {
        const decodedJson = await jwt.verify(tokenKey, secretString)
        if (Date.now() / 1000 > decodedJson.exp) {
            throw "Token expire, please login again"
        }
        const user = await User.findById(decodedJson.id)
        if (!user) {
            throw "Can not find user with this token"
        }
        if (user.isBanned === 1) {
            throw "User is blocked"
        }
        req.user = user
        return next()
    } catch (error) {
        next("Token error: " + error)
    }
}