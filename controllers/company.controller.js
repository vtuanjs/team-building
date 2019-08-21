const Company = require('../models/company.model')
const User = require('../models/user.model')

const add = async (req, res, next) => {
    const { name, address, emailDomain } = req.body
    try {
        const company = await Company.create({ name, address, emailDomain })
        res.json({
            result: "ok",
            message: "Create company successfully",
            data: company
        })
    } catch (error) {
        next(error)
    }
}

const deleteById = async (req, res, next) => {
    const { companyId } = req.params
    try {
        const company = await Company.findById(companyId)
        if (!company)
            throw "Can not find company with id: " + companyId

        const compareDate = (Date.now() - company.createdAt) / 1000
        if (compareDate >= 600)
            throw "You can not delete the company created after 10 min, you only can block it!"

        await company.deleteOne()

        res.json({
            result: "ok",
            message: "Delete company successfully!",
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    const { name, address } = req.body
    const companyId = req.user.role === "admin" ?
        req.body.companyId : req.user.company

    const query = {
        ...(name && { name }),
        ...(address && { address }),
    }
    try {
        const company = await Company.findByIdAndUpdate(
            companyId, query, { new: true }
        )

        if (!company) throw "Can not find company"

        res.json({
            result: "ok",
            message: "Update company success",
            data: company
        })
    } catch (error) {
        next(error)
    }
}

const blockCompanyById = async (req, res, next) => {
    const { companyId } = req.params
    try {
        const company = await Company.findByIdAndUpdate(
            companyId, { isBanned: 1 }, { upsert: true }
        )

        if (!company) throw "Can not find company"

        res.json({
            result: 'ok',
            message: `Block company with name: ${company.name} successfully!`
        })
    } catch (error) {
        next(error)
    }
}

const unlockCompanyById = async (req, res, next) => {
    const { companyId } = req.params
    try {
        const company = await Company.findByIdAndUpdate(
            companyId, { isBanned: 0 }, { upsert: true }
        )

        if (!company) throw "Can not find company"

        res.json({
            result: 'ok',
            message: `Unlock company with name: ${company.name} successfully!`
        })
    } catch (error) {
        next(error)
    }
}

const findByUserId = async (req, res, next) => {
    const userId = req.user.role === "admin" ?
        req.params.userId : req.user._id
    try {
        const company = await Company.findOne(
            { members: { $in: [userId] } },
            "name address emailDomain createdAt"
        )

        if (!company) return next("Can not find this company by user")

        res.json({
            result: "ok",
            message: "Find company by user successfully",
            data: company
        })
    } catch (error) {
        next(error)
    }

}

const showListCompany = async (_req, res, next) => {
    try {
        const company = Company.find(
            {},
            "name address emailDomain createdAt"
        )

        if (!company) return next("Can not show company")

        res.json({
            result: "ok",
            message: "Show list of company successfully",
            data: company
        })

    } catch (error) {
        next(error)
    }
}

const getDetailById = async (req, res, next) => {
    const companyId = req.user.role === "admin" ?
        req.params.companyId : req.user.company

    try {
        const company = await Company.findById(companyId)

        if (!company) return next("Wrong company id")

        res.json({
            result: "ok",
            message: "Get company detail successfully!",
            data: company
        })
    } catch (error) {
        next(error)
    }
}

const addMember = async (req, res, next) => {
    const { userId } = req.body

    const companyId = req.user.role === "admin" ?
        req.body.companyId : req.user.company

    try {
        const [company, user] = await Promise.all([
            Company.findById(companyId),
            User.findById(userId)
        ])

        if (!company || !user)
            throw "Can not find user or company"
        if (user.company)
            throw "User already in this / another company"

        await Promise.all([
            company.updateOne({ $push: { members: userId } }),
            user.updateOne({ company: companyId })
        ])

        return res.json({
            result: 'ok',
            message: `Add member with id: ${userId} successfully!`,
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const companyId = req.user.company

    try {
        const [company, user] = await Promise.all([
            Company.findById(companyId),
            User.findById(userId)
        ])

        if (!company || !user)
            throw "Can not find user or company"

        await Promise.all([
            company.updateOne({ $pull: { members: userId } }),
            user.updateOne({ $unset: { company } })
        ])

        return res.json({
            result: 'ok',
            message: `Add member with id: ${userId} successfully!`,
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { userId, role } = req.body
    const signedUser = req.user

    const companyId = signedUser.role === "admin" ?
        req.body.companyId : signedUser.company

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }
    try {
        const [company, user] = await Promise.all([
            Company.findById(companyId),
            User.findById(userId)
        ])

        if (!company || !user) throw "Can not find user or company"

        await user.updateOne({ role })

        res.json({
            result: 'ok',
            message: `${user.name} is now ${role} of company: ${company.name}!`,
        })
    } catch (error) {
        next(error)
    }
}

const upgradeVip = async (req, res, next) => {
    const { companyId, vip } = req.body

    try {
        const value = vip.trim().toLowerCase()
        let limited = {}

        switch (value) {
            case "vip1":
                limited = {
                    members: 100,
                    teams: 10,
                    space: 100,
                    projects: 9999,
                    plants: 9999,
                    jobs: 9999,
                }
                break
            case "vip2":
                limited = {
                    members: 200,
                    teams: 30,
                    space: 1000,
                    projects: 9999,
                    plants: 9999,
                    jobs: 9999,
                }
                break
            case "vip3":
                limited = {
                    members: 9999,
                    teams: 9999,
                    space: 5000,
                    projects: 9999,
                    plants: 9999,
                    jobs: 9999,
                }
                break
            default:
                limited = {
                    members: 10,
                    teams: 2,
                    space: 5,
                    projects: 1,
                    plants: 5,
                    jobs: 20,
                }
                break
        }

        const company = await Company.findByIdAndUpdate(
            companyId,
            { limited, lastUpgradeVip: Date.now() },
            { new: true }
        ).select("limited lastUpgradeVip")

        if (!company) throw "Can not find company with id: " + companyId

        res.json({
            result: 'ok',
            message: `Update company ${company.name} to ${vip} successfully`,
            data: company
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    add,
    update,
    blockCompanyById,
    unlockCompanyById,
    findByUserId,
    getDetailById,
    deleteById,
    showListCompany,
    addMember,
    removeMember,
    changeUserRole,
    upgradeVip
}