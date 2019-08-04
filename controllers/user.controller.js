const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Company = require('../models/company.model')

const addToCompanyMemberByEmailDomain = (user, emailDomain) => {
    Company.findOne({ emailDomain }, (error, company) => {
        if (company) {
            Promise.all([
                user.updateOne({ company: { ...user.company, id: company._id } }),
                company.updateOne({ $push: { members: user._id } })
            ])
        }
        return
    })
}

const create = async (req, res, next) => {
    const { name, email, password } = req.body
    const emailDomain = email.toLowerCase().split("@")[1]
    try {
        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        let newUser = await User.create({
            name,
            email,
            password: encryptedPassword
        })
        addToCompanyMemberByEmailDomain(newUser, emailDomain)
        res.json({
            result: 'ok',
            message: 'Create user successfully!',
        })
    } catch (error) {
        if (error.code === 11000) error = "Email already exists"
        res.status(422)
        next(error)
    }
}

const update = async (req, res, next) => {
    let { name, gender, phone, address, password, oldPassword} = req.body
    try {
        let user = res.locals.user
        if (password){
            let checkPassword = await bcrypt.compare(oldPassword, user.password)
            if (!checkPassword) return next("Old password wrong")
            else {
                password = await bcrypt.hash(password, 10)
            }
        }
        let query = {
            ...(name && { name }),
            ...(gender && { gender }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(password && { password }),
        }
        await user.updateOne(query, {new: true})
        res.json({
            result: 'ok',
            message: 'Update user succesfully!',
        })
    } catch (error) {
        next("Update error: " + error)
    }
}

const blockByIds = async (req, res, next) => {
    const { userIds } = req.body
    const { user } = res.locals
    const arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    try {
        let raw
        if (user.role === "admin"){
            raw = await User.updateMany({ _id: { $in: arrayUserIds } }, { isBanned: 1 })
        } else {
            raw = await User.updateMany({ _id: { $in: arrayUserIds }, "company.id" : user.company.id }, { isBanned: 1 })
        }
        res.json({
            result: "ok",
            message: "Number of users blocked: " + raw.nModified
        })
    } catch(error){
        next(error)
    }
}

module.exports = {
    create, update, blockByIds
}