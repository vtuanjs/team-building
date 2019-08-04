const Project = require('../models/project.model')
const Company = require('../models/company.model')

const add = async (req, res, next) => {
    let signedInUser = res.locals.user
    let { title, description, companyId } = req.body
    try {

        let newProject = await Project.create({
            title,
            description,
            company: companyId,
            members: [signedInUser._id]
        })
        await Company.findByIdAndUpdate(companyId, {
            $push: { projects: newProject._id }
        })
        await signedInUser.updateOne({projects: [...signedInUser.projects, {id: newProject._id, role: "author"}]})
        res.json({
            result: 'ok',
            message: 'Add new project successfully!',
            data: newProject
        })
    } catch (error) {
        next(error)
    }
}

const findAllInCompany = async (req, res, next) => {
    let { companyId } = req.query
    try {
        let project = await Project.find({ company: companyId })
        if (!project) throw "Can not find projects in this company"
        res.json({
            result: "ok",
            message: "Find projects in company successfully!",
            data: project
        })
    } catch(error){
        next(error)
    }
}

const update = async (req, res, next) => {
    let { projectId, title, description } = req.body
    try {
        let project = await Project.findById(projectId)
        if (!project)
            throw `Can not find project`
        let query = {
            ...(title && { title }),
            ...(description && { description }),
        }
        await project.updateOne(query, {new: true})
        res.json({
            result: 'ok',
            message: 'Update project succesfully!',
        })
    } catch (error) {
        next("Update error: " + error)
    }
}

const getListUsersByProjectId = (req, res, next) => {
    let { projectId } = req.params
    return Project.findById(projectId, "member", (err, doc) => {
        if (err) return next(err)
        if (!doc) return next("Project not found")
        return res.json({
            result: 'ok',
            message: "Find list of users successfully",
            data: doc
        })
    })
}

const getCompanyIdFromProjectId = async ( projectId, next ) => {
    let company = await Company.findOne({projects: { $in: [projectId]}}, (err, doc) => {
        if (err) return next(err)
        if (!doc) return next("Can not find company: " + err)
    })
    return company._id
}

module.exports = {
    add,
    update,
    findAllInCompany,
    getListUsersByProjectId,
    getCompanyIdFromProjectId
}