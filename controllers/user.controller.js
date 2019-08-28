const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Company = require('../models/company.model')

const addCompanyMemberByEmailDomain = async (user, emailDomain) => {
    try {
        const updatedCompany = await
            Company.findOneAndUpdate({ emailDomain }, { $push: { members: user._id } })
        if (!updatedCompany) return
        else {
            user.company.id = updatedCompany._id
            await user.save()
        }
    } catch (error) {
        throw error
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

        await addCompanyMemberByEmailDomain(newUser, emailDomain)

        res.json({ message: `Create user ${newUser.name} successfully!` })
    } catch (error) {
        if (error.code === 11000) error = "Email already exists"
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

        res.json({ message: `Update user with ID: ${user._id} succesfully!` })
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
            { $set: { isBanned: 1 } },
        )

        res.json({ message: "Block users successfully!" })
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
            { $set: { isBanned: 0 } }
        )

        res.json({ message: "Unlock users successfully!" })
    } catch (error) {
        next(error)
    }
}

const findByEmail = async (req, res, next) => {
    const { email } = req.params
    try {
        const foundUser = await User.findOne({ email: email.trim().toLowerCase() }).select("name email")

        if (!foundUser) throw "Nothing"

        res.json({ user: foundUser })
    } catch (error) {
        next(error)
    }
}

const getDetailById = async (req, res, next) => {
    const userId = req.params.userId

    const query = req.user.role === "admin" ? { _id: userId } :
        { _id: userId, company: req.user.company.id }

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

        res.json({ user: foundUser })
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (_req, res, next) => {
    try {
        const foundUsers = await User.find().select("name email createdAt")

        if (!foundUsers) next("Can not show list of users")

        res.json({ users: foundUsers })
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
    getAllUser,
    findByEmail
}