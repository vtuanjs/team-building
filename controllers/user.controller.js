const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Company = require('../models/company.model')

const addToCompanyMemberByEmailDomain = (user, emailDomain) => {
    Company.findOne({ emailDomain }, (error, company) => {
        if (company) {
            Promise.all([
                user.updateOne({ company: company._id }),
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
        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword
        })
        addToCompanyMemberByEmailDomain(newUser, emailDomain)
        res.json({
            result: 'ok',
            message: `Create user ${newUser.name} successfully!`,
        })
    } catch (error) {
        if (error.code === 11000) error = "Email already exists"
        res.status(422)
        next(error)
    }
}

const update = async (req, res, next) => {
    let { name, gender, phone, address, password, oldPassword } = req.body
    try {
        const user = req.user
        if (password) {
            const checkPassword = await bcrypt.compare(oldPassword, user.password)
            if (!checkPassword) return next("Old password wrong")
            else {
                password = await bcrypt.hash(password, 10)
            }
        }
        const query = {
            ...(name && { name }),
            ...(gender && { gender }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(password && { password }),
        }
        await user.updateOne(query)
        res.json({
            result: 'ok',
            message: `Update user with ID: ${user._id} succesfully!`,
        })
    } catch (error) {
        next("Update error: " + error)
    }
}

const blockByIds = async (req, res, next) => {
    const { userIds } = req.body
    const { user } = req
    const arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    try {
        if (arrayUserIds.indexOf(user._id) > -1) {
            throw "Can not block your self"
        }
        await User.updateMany(
            { _id: { $in: arrayUserIds } },
            { isBanned: 1 },
            { upsert: true },
        )
        res.json({
            result: "ok",
            message: "Block users successfully!"
        })
    } catch (error) {
        next(error)
    }
}

const unlockByIds = (req, res, next) => {
    const { userIds } = req.body
    const arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    return User.updateMany(
        { _id: { $in: arrayUserIds } },
        { isBanned: 0 },
        { upsert: true },
        (error, raw) => {
            if (error) return next(error)
            res.json({
                result: "ok",
                message: "Unlock users successfully!"
            })
        }
    )
}

const getDetailById = async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.params.userId)
            .select("-password -role")
            .populate("company.id", "name")
            .populate("projects.id", "title")
            .populate("plants.id", "title")
            // .populate("jobs", "title")
            .populate("teams.id", "name")
            // .populate("comments", "body comentOn")
            .exec()

        if (!foundUser) next("Can not find this user")
        res.json({
            result: 'ok',
            message: 'Get detail success',
            data: foundUser
        })
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req, res, next) => {
    const foundUsers = await User.find().select("name createdAt")
    if (!foundUsers) next("Can not show list of users")
    res.json({
        result: 'ok',
        message: 'Show list of all users successfully!',
        data: foundUsers
    })
}

module.exports = {
    create,
    update,
    blockByIds,
    unlockByIds,
    getDetailById,
    getAllUser
}