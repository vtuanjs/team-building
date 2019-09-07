const Project = require('../models/project.model')
const Company = require('../models/company.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postProject = async (req, res, next) => {
    const { title, description } = req.body
    const signedUser = req.user
    const companyId = req.user.company.id
    try {
        const project = await Project.create(
            {
                title,
                description,
                company: companyId,
                members: [signedUser._id]
            }
        )

        signedUser.projects.push({ id: project._id, role: "author" })

        await Promise.all([
            Company.findByIdAndUpdate(
                companyId,
                { $addToSet: { projects: project._id } }
            ),
            signedUser.save()
        ])

        res.json({ message: `Create project successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const setProjectInTrash = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await Project.findByIdAndUpdate(projectId, { isInTrash: 1 }, { upsert: true, new: true }).select('title isInTrash')

        if (!project) throw "Can not find project"

        res.json({ message: `Send project ${project.title} to trash successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const unsetProjectInTrash = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await Project.findByIdAndUpdate(projectId, { isInTrash: 0 }, { upsert: true, new: true }).select('isInTrash')

        if (!project) throw "Can not find project"

        res.json({ message: `Restore project ${project.title} successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const hiddenProject = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await Project.findByIdAndUpdate(projectId, { isHidden: 1 }, { upsert: true, new: true }).select('isHidden')

        if (!project) throw "Can not find project"

        res.json({ message: `Hidden project ${project.title} successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const unHiddenProject = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await Project.findByIdAndUpdate(projectId, { isHidden: 0 }, { upsert: true, new: true }).select('isHidden')

        if (!project) throw "Can not find project"

        res.json({ message: `Unhidden project ${project.title} successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const deleteProject = async (req, res, next) => {
    const { projectId } = req.params

    const session = await mongoose.startSession()
    try {
        session.withTransaction(async () => {
            const [project, _] = await Promise.all([
                Project.findByIdAndDelete(projectId).session(session),

                User.updateMany(
                    { "projects.id": projectId },
                    { $pull: { projects: { id: projectId } } }
                ).session(session)
            ])

            if (!project)
                throw "Can not find project or user"

            res.json({ message: "Delete project successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updateProject = async (req, res, next) => {
    const { projectId } = req.params
    const { name, address } = req.body

    const query = {
        ...(name && { name }),
        ...(address && { address }),
    }
    try {
        const project = await Project.findByIdAndUpdate(
            projectId, query, { new: true }
        )

        if (!project) throw "Can not find project"

        res.json({ message: `Update project ${project.name} successfully!`, project })
    } catch (error) {
        next(error)
    }
}

const getProjects = async (req, res, next) => {
    const signedUser = req.user

    let condition = {}

    if (signedUser.role === 'user') {
        condition = { company: signedUser.company.id }
    }
    try {
        const projects = await Project.find(
            condition,
            "title createdAt"
        )

        if (!projects) throw "Can not show project"

        res.json({ projects })
    } catch (error) {
        next(error)
    }
}

const getProject = async (req, res, next) => {
    const { projectId } = req.params

    try {
        const project = await Project.findById(projectId)

        if (!project) throw "Wrong project id"

        res.json({ project })
    } catch (error) {
        next(error)
    }
}

const addMembers = async (req, res, next) => {
    const { userIds } = req.body
    const { projectId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            let arrayUserIds = userIds
            if (typeof userIds === 'string') {
                arrayUserIds = userIds.split(',').map(item => {
                    return item.trim()
                })
            }

            const users = await User.find({ _id: { $in: arrayUserIds } })

            if (users.length === 0) throw "Can not find any user"

            const validUserIds = users.map(user => user._id)

            const [project, _] = await Promise.all([
                Project.findOneAndUpdate(
                    { _id: projectId },
                    { $addToSet: { members: { $each: validUserIds } } },
                    { new: true }
                ).select('members').session(session),

                User.updateMany(
                    { _id: { $in: validUserIds }, "projects.id": { $ne: projectId } },
                    { $push: { projects: { id: projectId, role: "employee" } } }
                ).session(session)
            ])

            if (!project)
                throw "Can not find project"

            return res.json({
                message: `Add member successfully!`, project
            })
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const { projectId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [project, _] = await Promise.all([
                Project.findByIdAndUpdate(projectId, { $pull: { members: userId } }, { new: true }).session(session),
                User.findByIdAndUpdate(userId, { $unset: { "projects.id": projectId } }).session(session)
            ])

            if (!project)
                throw "Can not find project"

            return res.json({ message: `Remove member successfully!`, project })
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { projectId } = req.params
    const { userId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [project, user] = await Promise.all([
                Project.findById(projectId),
                User.findOneAndUpdate(
                    { _id: userId, "projects.id": projectId },
                    { $set: { "projects.$.role": role } },
                    { new: true }
                ).session(session)
            ])

            if (!user || !project) throw "Can not find user/project or user not a member in project"

            res.json({
                message: `${user.name} is now ${role}!`, user: {_id: user._id, projects: user.projects}
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postProject,
    setProjectInTrash,
    unsetProjectInTrash,
    hiddenProject,
    unHiddenProject,
    deleteProject,
    updateProject,
    getProjects,
    getProject,
    addMembers,
    removeMember,
    changeUserRole
}