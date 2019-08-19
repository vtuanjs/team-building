const Company = require('../models/company.model')
const User = require('../models/user.model')

const add = (req, res, next) => {
    const { name, address, emailDomain } = req.body

    return Company.create(
        { name, address, emailDomain },
        (error, doc) => {
            if (error) return next(error)

            res.json({
                result: "ok",
                message: "Create company successfully",
                data: doc
            })
        }
    )
}

const deleteById = (req, res, next) => {
    const { companyId } = req.params

    return Company.findById(companyId, (error, doc) => {
        if (error) return next(error)
        if (!doc)
            return next("Can not find company with id: " + companyId)

        const compareDate = (Date.now() - doc.createdAt) / 1000

        if (compareDate >= 600)
            return next("You can not delete the company created after 10 min, you only can block it!")

        Promise.all([
            doc.deleteOne(),
            res.json({
                result: "ok",
                message: "Delete company successfully!",
            })
        ]).catch(error => next(error))
    })
}

const update = (req, res, next) => {
    const { companyId, name, address } = req.body

    const query = {
        ...(name && { name }),
        ...(address && { address }),
    }

    return Company.findByIdAndUpdate(
        companyId,
        query,
        { new: true },
        (err, doc) => {
            if (err) return next(err)
            if (!doc) return next("Can not find company")

            res.json({
                result: "ok",
                message: "Update company success",
                data: doc
            })
        }
    )
}

const blockCompanyById = (req, res, next) => {
    const { companyId } = req.params

    return Company.findByIdAndUpdate(
        companyId,
        { isBanned: 1 },
        { upsert: true },
        (error, document) => {
            if (error) return next(error)
            if (!document) return next("Can not find company")

            res.json({
                result: 'ok',
                message: `Block company with name: ${document.name} successfully!`
            })
        }
    )
}

const unlockCompanyById = (req, res, next) => {
    const { companyId } = req.params

    return Company.findByIdAndUpdate(
        companyId,
        { isBanned: 0 },
        { upsert: true },
        (error, document) => {
            if (error) return next(error)
            if (!document) return next("Can not find company")

            res.json({
                result: 'ok',
                message: `Unlock company with name: ${document.name} successfully!`
            })
        }
    )
}

const findByUserId = (req, res, next) => {
    const { userId } = req.params

    return Company.findOne({ members: { $in: [userId] } },
        "name address emailDomain createdAt",
        (error, doc) => {
            if (error) return next(error)
            if (!doc) return next("Can not find this company by user")

            res.json({
                result: "ok",
                message: "Find company by user successfully",
                data: doc
            })
        }
    )
}

const showCompany = (req, res, next) => {
    return Company.find(
        {},
        "name address emailDomain createdAt",
        (error, docs) => {
            if (error) return next(error)
            if (!docs) return next("Can not show company")

            res.json({
                result: "ok",
                message: "Show list of company successfully",
                data: docs
            })
        }
    )
}

const getDetailById = (req, res, next) => {
    const { companyId } = req.params

    return Company.findById(companyId, (error, doc) => {
        if (error) return next(error)
        if (!doc) return next("Wrong company id")

        res.json({
            result: "ok",
            message: "Get company detail successfully!",
            data: doc
        })
    })
}

const addMember = (req, res, next) => {
    const { userId, role, companyId } = req.body

    Promise.all([
        Company.findById(companyId),
        User.findById(userId)
    ]).then(([company, user]) => {
        if (!company || !user)
            throw "Can not find user or company"
        if (company.members.indexOf(userId) > -1)
            throw "User already in company"

        Promise.all([
            company.updateOne({ $push: { members: userId } }),
            user.updateOne({ company: { id: userId, role: role } })
        ]).then(() => {
            return res.json({
                result: 'ok',
                message: `Add member with id: ${userId} successfully!`,
            })
        })
    }).catch(error => next(error))
}

const changeRole = (req, res, next) => {
    return (role) => {
        let { userId, companyId } = req.body
        const signedUser = req.user

        if (!companyId) companyId = signedUser.company.id

        Promise.all([
            Company.findById(companyId),
            User.findById(userId)
        ]).then(([company, user]) => {
            if (!company || !user) return next("Can not find user or company")

            return user.updateOne(
                { company: { id: companyId, role: role } },
                (error, result) => {
                    if (error) throw error

                    res.json({
                        result: 'ok',
                        message: `${user.name} is now ${role} of company: ${company.name}!`,
                    })
                }
            )
        }).catch(error => next(error))
    }
}

const makeMemberBecomeManager = (req, res, next) => {
    changeRole(req, res, next)("manager")
}

const makeManagerBecomeMember = (req, res, next) => {
    changeRole(req, res, next)("employee")
}

module.exports = {
    add,
    update,
    blockCompanyById,
    unlockCompanyById,
    findByUserId,
    getDetailById,
    deleteById,
    showCompany,
    addMember,
    makeMemberBecomeManager,
    makeManagerBecomeMember
}