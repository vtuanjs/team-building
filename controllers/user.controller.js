const User = require('../models/user.model')
const Company = require('../models/company.model')
const userMiddleware = require('../middlewares/user.middleware')
const bcrypt = require('bcrypt')

const create = async (name, email, password) => {
    email = email.toLowerCase()
    try {
        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword
        })
        const emailDomain = email.split("@")[1]
        const company = await Company.findOne({emailDomain})
        if (company) {
            Promise.all([
                newUser.update({company: {...newUser.company, id: company._id}}),
                company.update({$push: {members: newUser._id}})
            ])
        }
    } catch (error) {
        if (error.code === 11000) throw "Email already exists"
        throw error
    }
}

const blockByIds = async (userIds, tokenKey) => {
    let arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    try {
        let signedInUser = await verifyJWT(tokenKey)
        if (userMiddleware.isAdmin(signedInUser)) {
            User.updateMany({ _id: { $in: arrayUserIds } }, { isBanned: 1 })
        } else {
            if (signedInUser.company.userPermission === 1) {
                User.updateMany({ _id: { $in: arrayUserIds }, company: { id: signedInUser.company.id } }, { isBanned: 1 })
            } else {
                throw "You are not an admin"
            }
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    create, blockByIds
}