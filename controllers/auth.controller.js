const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretString = "secret string"

module.exports.login = async (email, password) => {
    try {
        let foundUser = await User.findOne({ email: email.trim() }).exec()
        if (!foundUser) {
            throw "User does not exist"
        }
        if (foundUser.isBanned === 1) {
            throw "User is banned. Please contact your website admin"
        }
        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword === true) {
            let jsonObject = {
                id: foundUser._id
            }
            let tokenKey = await jwt.sign(jsonObject,
                secretString, {
                    expiresIn: 86400 // Expire in 24h
                })
            //Return user infomation with token key
            let userObject = foundUser.toObject()
            userObject.tokenKey = tokenKey
            return userObject
        } else {
            throw 'Wrong user or password'
        }
    } catch (error) {
        throw error
    }
}
