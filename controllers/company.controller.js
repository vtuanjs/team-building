const Company = require('../models/company.model')

const add = async (req, res, next) => {
    const { name, address, emailDomain } = req.body
    try {
        let newCompany = await Company.create({
            name, address,
            emailDomain
        })
        res.json({
            result: "ok",
            message: "Create company successfully",
            data: newCompany
        })
    } catch (error) {
        next(error)
    }
}
const update = (req, res, next) => {
    let { companyId, name, address } = req.body
    let query = {
        ...(name && { name }),
        ...(address && { address }),
    }
    return Company.findOneAndUpdate(
        { _id: companyId },
        query,
        { new: true },
        (err, doc) => {
            if (err) return next(err)
            if (!doc) return next("Can not find company")
            return res.json({
                result: "ok",
                message: "Update company success",
                data: doc
            })
        }
    )
}

const blockCompanyById = (req, res, next) => {
    let { companyId } = req.params
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
    let { companyId } = req.params
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
    let { userId } = req.params
    return Company.findOne({ members: { $in: [userId] } },
        "name address createdAt",
        (error, doc) => {
            if (error) return next(error)
            if (!doc) return next("Can not find this company by user")
            return res.json({
                result: "ok",
                message: "Find company by user successfully",
                data: doc
            })
        }
    )
}

const getDetailById = (req, res, next) => {
    let { companyId } = req.params
    return Company.findById(companyId, (error, doc) => {
        if (error) return next(error)
        if (!doc) return next("Wrong company id")
        return res.json({
            result: "ok",
            message: "Get company detail successfully!",
            data: doc
        })
    })
}

module.exports = {
    add,
    update,
    blockCompanyById,
    unlockCompanyById,
    findByUserId,
    getDetailById
}