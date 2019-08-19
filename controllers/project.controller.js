const Project = require('../models/project.model')
const Company = require('../models/company.model')
const User = require('../models/user.model')

const add = (req, res, next) => {
    const signedInUser = req.user
    const { title, description, companyId } = req.body
    Promise.all([
        Project.countDocuments({ company: companyId }),
        Company.findById(companyId)
    ]).then(([project, company]) => {
        if (project >= company.limited.projects)
            return next("Your company is limited add new project, please upggrade your account")
        return Promise.all(
            [
                Project.create({
                    title,
                    description,
                    company: companyId,
                    members: [signedInUser._id]
                }),
                company
            ]
        )
    }).then(([newProject, company]) => {
        Promise.all([
            company.update({
                $push: { projects: newProject._id }
            }),
            signedInUser.updateOne({ projects: [...signedInUser.projects, { id: newProject._id, role: "author" }] }),
            res.json({
                result: 'ok',
                message: 'Add new project successfully!',
                data: newProject
            })
        ])
    }).catch(error => next(error))
}

const findAllInCompany = (req, res, next) => {
    const { companyId } = req.params
    return Project.find({ company: companyId })
        .select("title createdAt")
        .exec((error, document) => {
            if (!document) return next("Can not find projects in this company")
            if (error) return next(error)
            res.json({
                result: "ok",
                message: "Find projects in company successfully!",
                data: document
            })

        })
}

const update = async (req, res, next) => {
    const { projectId, title, description, isHidden } = req.body
    try {
        const project = await Project.findById(projectId)
        if (!project)
            throw `Can not find project`
        const query = {
            ...(title && { title }),
            ...(description && { description }),
            ...(isHidden && { isHidden })
        }
        await project.updateOne(query)
        res.json({
            result: 'ok',
            message: `Update project with ID: ${projectId} succesfully!`,
        })
    } catch (error) {
        next("Update error: " + error)
    }
}

const getListUsersByProjectId = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await Project.findById(projectId)
            .select("members")
            .populate("members", "name")
        if (!project) return next("Project not found")
        res.json({
            result: 'ok',
            message: "Find list of users successfully",
            data: project
        })
    } catch (error) {
        next(error)
    }
}

const addMember = (req, res, next) => {
    const { userId, role, projectId } = req.body
    Promise.all([
        Project.findById(projectId),
        User.findById(userId)
    ]).then(values => {
        if (!values[0] || !values[1]) return next("Can not find user or project")

        Promise.all([
            values[0].updateOne({ $push: { members: userId } }),
            values[1].updateOne({ $push: { projects: { id: userId, role: role } } })
        ]).then(values => {
            return res.json({
                result: 'ok',
                message: `Add member with id: ${userId} successfully!`,
            })
        })
    }).catch(error => next(error))
}

const makeMemberBecomeManager = async (req, res, next) => {
    const { userId, companyId } = req.params


}

const makeManagerBecomeMember = async (req, res, next) => {
    const { userId, companyId } = req.params


}

const RemoveMember = async (req, res, next) => {
    const { userId, companyId } = req.params


}

const findProject = (projectId) => {
    return Project.findById(projectId)
}

module.exports = {
    add,
    update,
    findAllInCompany,
    getListUsersByProjectId,
    findProject,
    addMember
}