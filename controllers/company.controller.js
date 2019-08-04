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

const showMembersById = (req, res, next) => {
    let { companyId } = req.params
    return Company.findById(companyId, (error, doc) => {
        if (error) return next(error)
        if (!doc) return next("Wrong company id")
        return res.json({
            result: "ok",
            message: "Show list of member in this company successfully",
            data: doc
        })
    })
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

const getCompanyIdFromUserId = async ( userId, next ) => {
    let company = await Company.findOne({members: { $in: [userId]}}, (err, doc) => {
        if (err) return next(err)
        if (!doc) return next("Can not find company: " + err)
    })
    return company._id
}

module.exports = {
    add,
    showMembersById,
    update,
    findByUserId,
    getCompanyIdFromUserId
}