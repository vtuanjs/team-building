const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Company = require('../models/company.model')

const postUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const emailDomain = email.toLowerCase().split("@")[1]
        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10

        const user = await User.create({
            name,
            email,
            password: encryptedPassword
        })

        // If user email domain = company email domain, auto add this user to company
        const updatedCompany = await
            Company.findOneAndUpdate({ emailDomain }, { $push: { members: user._id } })
        if (updatedCompany) {
            user.company.id = updatedCompany._id
            await user.save()
        }

        res.json({ message: `Create user ${newUser.name} successfully!`, user })
    } catch (error) {
        if (error.code === 11000) error = "Email already exists"
        next(error)
    }
}

const createAdmin = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        let isAdminExist = await User.findOne({ role: "admin" })
        if (isAdminExist) {
            throw "This function only use one time!"
        }

        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10

        const user = await User.create({
            name,
            email,
            role: "admin",
            password: encryptedPassword
        })

        res.json({ message: `Create admin ${newUser.name} successfully!`, user })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    let { name, gender, phone, address, password, oldPassword } = req.body
    const userId = req.params.userId
    try {
        let user = await User.findById(userId)

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

        Object.assign(user, query)
        await user.save()

        res.json({ message: `Update user with ID: ${user._id} succesfully!`, user })
    } catch (error) {
        next("Update error: " + error)
    }
}

const blockUsers = async (req, res, next) => {
    const { userIds } = req.params
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

const unlockUsers = async (req, res, next) => {
    const { userIds } = req.params
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

const deleteUser = async (req, res, next) => {
    const { userId } = req.params
    try {
        await User.deleteOne({_id: userId})

        res.json({ message: "Delete user successfully!" })
    } catch (error) {
        next(error)
    }
}

const findByEmail = async (req, res, next) => {
    const { email } = req.params
    try {
        const foundUser = await User.findOne({ email: email.trim().toLowerCase() }).select("name email company")
            .populate("company.id", "name")

        if (!foundUser) throw "Nothing"

        res.json({ user: foundUser })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    const userId = req.params.userId

    const query = req.user.role === "admin" ? { _id: userId } :
        { _id: userId, company: req.user.company.id }

    try {
        const foundUser = await User.findOne(query)
            .select("-password -isActive -isBanned")
            .populate([
                {
                    path: "company.id",
                    select: "name"
                },
                {
                    path: "projects.id",
                    select: "title"
                },
                {
                    path: "plants.id",
                    select: "title"
                },
                // {
                //     path: "jobs.id",
                //     select: "title"
                // },
                {
                    path: "teams.id",
                    select: "name"
                },
                // {
                //     path: "comments",
                //     select: "body comentOn"
                // }
            ])

        if (!foundUser) throw "User is not exist"

        res.json({ user: foundUser })
    } catch (error) {
        next(error)
    }
}

const getUsers = async (_req, res, next) => {
    try {
        const foundUsers = await User.find().select("name email createdAt")

        if (!foundUsers) next("Can not show list of users")

        res.json({ users: foundUsers })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postUser,
    createAdmin,
    updateUser,
    blockUsers,
    unlockUsers,
    deleteUser,
    findByEmail,
    getUser,
    getUsers
}