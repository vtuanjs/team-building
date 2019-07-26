const userMiddleware = require('../middlewares/user.middleware')
const Company = require('../models/company.model')

const add = async (company, tokenKey) => {
    let { name, address, emailDomain } = company
    email = email.toLowerCase()
    try {
        let signedInUser = await userMiddleware.verifyJWT(tokenKey)
        if (!userMiddleware.isAdmin(signedInUser)) {
            throw "Only admin can create company"
        }
        let newCompany = await Company.create({
            name, address,
            emailDomain
        })
        return newCompany
    } catch (error) {
        throw error
    }
}

const findByUserId = (userId) => {
    return Company.findOne({members: {$in: [userId]}}).select("name address createdOn" )
}

const showMembersById = async (id) => {
    try {
        let company = await Company.findById(id).select("members")
        if (!company) throw `Can not find company with Id=${id}`
        return company
    } catch (error) {
        throw error
    }
}

const update = async (id, updatedCompany, tokenKey) => {
    try {
        let signedInUser = await userMiddleware.verifyJWT(tokenKey)
        let { name, address } = updatedCompany
        if (!userMiddleware.isAdmin(signedInUser) ||
            (!userMiddleware.isCompanyManager(signedInUser, id))) {
            throw "Only manager can do this action"
        }
        let query = {
            ...(name && { name }),
            ...(address && { address }),
            lastUpdated: Date.now()
        }
        let company = await Company.findOneAndUpdate({ _id: id }, query, { new: true })
        if (!company) {
            throw `Can not find company`
        }
        return company
    } catch (error) {
        throw error
    }
}

module.exports = {
    add,
    showMembersById,
    update,
    findByUserId
}