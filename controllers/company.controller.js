const Company = require('../models/company.model')
const User = require('../models/user.model')
const mongoose = require('../database/database')

const create = async (req, res, next) => {
    const { name, address, emailDomain } = req.body
    try {
        const company = await Company.create({ name, address, emailDomain })
        res.json({ message: `Create company ${company.name} successfully!` })
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

        res.json({ message: "Delete company successfully!" })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    const { name, address, companyId } = req.body

    const query = {
        ...(name && { name }),
        ...(address && { address }),
    }
    try {
        const company = await Company.findByIdAndUpdate(
            companyId, query, { new: true }
        )

        if (!company) throw "Can not find company"

        res.json({ message: `Update company ${company.name} successfully!` })
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

        res.json({ message: `Block company with name: ${company.name} successfully!` })
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

        res.json({ message: `Unlock company with name: ${company.name} successfully!` })
    } catch (error) {
        next(error)
    }
}

const findByUserId = async (req, res, next) => {
    const { userId } = req.params
    try {
        const company = await Company.findOne(
            { members: { $in: [userId] } },
            "name address emailDomain createdAt"
        )

        if (!company) return next("Can not find this company by user")

        res.json({ company })
    } catch (error) {
        next(error)
    }

}

const showListCompany = async (_req, res, next) => {
    try {
        const companies = await Company.find(
            {},
            "name address emailDomain createdAt"
        )

        if (!companies) return next("Can not show company")

        res.json({ companies })
    } catch (error) {
        next(error)
    }
}

const getDetailById = async (req, res, next) => {
    const { companyId } = req.params

    try {
        const company = await Company.findById(companyId)

        if (!company) return next("Wrong company id")

        res.json({ company })
    } catch (error) {
        next(error)
    }
}

const addMember = async (req, res, next) => {
    const { userId, companyId } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [company, user] = await Promise.all([
            Company.findByIdAndUpdate(companyId, { $push: { members: userId } }).session(session),
            User.findByIdAndUpdate(userId, { $set: { "company.id": companyId, "company.role": "employee" } }).session(session)
        ])

        if (!company || !user)
            throw "Can not find user or company"
        if (user.company.id || (company.members.indexOf(userId) > -1))
            throw "User already in company"

        await session.commitTransaction();
        session.endSession();

        return res.json({
            message: `Add member with id: ${userId} successfully!`,
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId, companyId } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const [company, user] = await Promise.all([
            Company.findByIdAndUpdate(companyId, { $pull: { members: userId } }).session(session),
            User.findByIdAndUpdate(userId, { $unset: { company } }).session(session)
        ])

        if (!company || !user)
            throw "Can not find user or company"

        await session.commitTransaction();
        session.endSession();

        return res.json({
            result: 'ok',
            message: `Add member with id: ${userId} successfully!`,
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { userId, companyId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    try {
        const company = await Company.findById(companyId)

        if (!company) throw "Can not find company"

        const user = await user.findByIdAndUpdate(userId, { "company.role": role })

        if (!company) throw "Can not find user"

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
    create,
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