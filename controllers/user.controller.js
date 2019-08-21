const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Company = require('../models/company.model')

const addCompanyMemberByEmailDomain = async (user, emailDomain) => {
    try {
        const company = await Company.findOne({ emailDomain })
        if (company) await Promise.all([
            user.updateOne({ company: company._id }),
            company.updateOne({ $push: { members: user._id } })
        ])
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const emailDomain = email.toLowerCase().split("@")[1]
        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10

        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword
        })

        addCompanyMemberByEmailDomain(newUser, emailDomain)

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
            if (!checkPassword) throw "Old password wrong"
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
    const signedUser = req.user
    try {
        const arrayUserIds = userIds.split(',').map(item => {
            return item.trim()
        })

        if (arrayUserIds.indexOf(signedUser._id.toString()) > -1) {
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

const unlockByIds = async (req, res, next) => {
    const { userIds } = req.body
    try {
        const arrayUserIds = userIds.split(',').map(item => {
            return item.trim()
        })

        await User.updateMany(
            { _id: { $in: arrayUserIds } },
            { isBanned: 0 },
            { upsert: true }
        )

        res.json({
            result: "ok",
            message: "Unlock users successfully!"
        })
    } catch (error) {
        next(error)
    }
}

const getDetailById = async (req, res, next) => {
    const userId = req.params.userId

    const query = req.user.role === "admin" ? { _id: userId } :
        { _id: userId, company: req.user.company }

    try {
        const foundUser = await User.findOne(query)
            .select("-password -isActive -isBanned")
            .populate([
                {
                    path: "company",
                    select: "name"
                },
                {
                    path: "project",
                    select: "title"
                },
                {
                    path: "plants",
                    select: "title"
                },
                // {
                //     path: "jobs",
                //     select: "title"
                // },
                {
                    path: "teams",
                    select: "name"
                },
                // {
                //     path: "comments",
                //     select: "body comentOn"
                // }
            ])

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
    const query = req.user.role === "admin" ? {} : { company: req.user.company }
    try {
        const foundUsers = await User.find(query).select("name email createdAt")

        if (!foundUsers) next("Can not show list of users")

        res.json({
            result: 'ok',
            message: 'Show list of all users successfully!',
            data: foundUsers
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    update,
    blockByIds,
    unlockByIds,
    getDetailById,
    getAllUser
}