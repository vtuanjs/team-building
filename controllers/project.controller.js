const userMiddleware = require('../middlewares/user.middleware')
const Project = require('../models/project.model')
const Company = require('../models/company.model')

const add = async (project, companyId, tokenKey) => {
    let { title, description } = project
    try {
        let signedInUser = await userMiddleware.verifyJWT(tokenKey)
        if (!userMiddleware.isCompanyManager(signedInUser, companyId))
            throw "Only company manager can add this project"
        let newProject = await Project.create({
            title,
            description,
            company: companyId,
            members: [signedInUser._id]
        })
        await Company.findByIdAndUpdate(companyId, {
            $push: { projects: newProject._id }
        })
        return newProject
    } catch (error) {
        throw error
    }
}

const findAllInCompany = async (companyId, tokenKey) => {
    try {
        let signedInUser = await userMiddleware.verifyJWT(tokenKey)
        if (!userMiddleware.isCompanyMember(signedInUser, companyId))
            throw "You are not company members"
        return Project.find({ members: { $in: [signedInUser._id] } })
    } catch (error) {
        throw error
    }
}

const update = async (id, updatedProject, tokenKey) => {
    let { title, description } = updatedProject
    try {
        let signedInUser = await userMiddleware.verifyJWT(tokenKey)
        let project = await Project.findById(id)
        if (!project) {
            throw `Can not find project`
        }
        if (!userMiddleware.isCompanyMember(signedInUser, project.company)) throw "Only company manager can updated this project"
        let query = {
            ...(title && { title }),
            ...(description && { description }),
            lastUpdated: Date.now()
        }
        project = await Project.findOneAndUpdate({ _id: id }, query, { new: true })
        return project
    } catch (error) {
        throw error
    }
}

module.exports = {
    add,
    update,
    findAllInCompany
}