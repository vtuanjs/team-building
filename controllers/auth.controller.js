const User = require('../models/user.model')
const Company = require('../models/company.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretString = "secret string"

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        let foundUser = await User.findOne({ email: email.trim() }).exec()
        if (!foundUser) {
            throw "User does not exist"
        }
        if (foundUser.isBanned === 1) {
            throw "User is banned. Please contact your website admin"
        }
        if (foundUser.role != "admin"){
            let company = await Company.findById(foundUser.company.id)
            if (company.isBanned){
                throw "Your company is banned. Please contact your website admin"
            }
        }
        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword) {
            let jsonObject = {
                id: foundUser._id
            }
            let tokenKey = await jwt.sign(
                jsonObject,
                secretString,
                { expiresIn: 86400 }
            )
            //Return user infomation with token key
            let userObject = foundUser.toObject()
            userObject.tokenKey = tokenKey
            return res.json({
                result: "ok",
                message: "Login user successfully",
                data: userObject
            })
        } else {
            return next("Wrong user or password")
        }
    } catch (error) {
        next(error)
    }
}
