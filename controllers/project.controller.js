const Project = require('../models/project.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postProject = async (req, res, next) => {
    const { title, description } = req.body
    const signedUser = req.user
    try {
        const project = await Project.create(
            {
                title,
                description,
                company: signedUser.company.id,
                members: [signedUser._id]
            }
        )

        signedUser.projects.push({ id: project._id, role: "author" })

        await Promise.all([
            Company.findByIdAndUpdate(
                signedUser.company.id,
                { $addToSet: { projects: project._id } }
            ),
            signedUser.save()
        ])

        res.json({ message: `Create project ${project.title} successfully!` })
    } catch (error) {
        next(error)
    }
}

const setProjectInTrash = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await findByIdAndUpdate(projectId, { isInTrash: 1 }, { upsert: true })

        if (!project) throw "Can not find project"

        res.json({ message: `Send project ${project.title} to trash successfully!` })
    } catch (error) {
        next(error)
    }
}

const unsetProjectInTrash = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await findByIdAndUpdate(projectId, { isInTrash: 0 }, { upsert: true })

        if (!project) throw "Can not find project"

        res.json({ message: `Restore project ${project.title} successfully!` })
    } catch (error) {
        next(error)
    }
}

const hiddenProject = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await findByIdAndUpdate(projectId, { isHidden: 1 }, { upsert: true })

        if (!project) throw "Can not find project"

        res.json({ message: `Hidden project ${project.title} successfully!` })
    } catch (error) {
        next(error)
    }
}

const unHiddenProject = async (req, res, next) => {
    const { projectId } = req.params
    try {
        const project = await findByIdAndUpdate(projectId, { isHidden: 0 }, { upsert: true })

        if (!project) throw "Can not find project"

        res.json({ message: `Unhidden project ${project.title} successfully!` })
    } catch (error) {
        next(error)
    }
}

const deleteProject = async (req, res, next) => {
    const { projectId } = req.params

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [project, _] = await Promise.all([
            Project.findByIdAndDelete(projectId).session(session),
            User.updateMany(
                { "projects.id": projectId },
                { $pull: { projects: { id: projectId } } }
            ).session(session)
        ])

        if (!project)
            throw "Can not find project or user"

        const compareDate = (Date.now() - project.createdAt) / 1000
        if (compareDate >= 864000)
            throw "You can not delete the project created after 10 days, you only can hidden it!"

        await session.commitTransaction()
        session.endSession()

        res.json({ message: "Delete project successfully!" })
    } catch (error) {
        session.abortTransaction()
        session.endSession()

        next(error)
    }
}

const updateProject = async (req, res, next) => {
    const projectId = req.params
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
    const companyId = req.user.company.id
    try {
        const projects = await Project.find(
            { company: companyId },
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

const addMember = async (req, res, next) => {
    const { userId, projectId } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [project, user] = await Promise.all([
            Project.findOneAndUpdate(
                { _id: projectId, members: { $ne: userId } },
                { $push: { members: userId } }
            ).session(session),
            User.findOneAndUpdate(
                { _id: userId, "projects.id": { $ne: projectId } },
                { $push: { projects: { id: projectId, role: "employee" } } }
            ).session(session)
        ])

        if (!project || !user)
            throw "Can not find user or project"

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
    const { userId, projectId } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const [project, _] = await Promise.all([
            Project.findByIdAndUpdate(projectId, { $pull: { members: userId } }).session(session),
            User.findByIdAndUpdate(userId, { $unset: { "projects.id": projectId } }).session(session)
        ])

        if (!project)
            throw "Can not find project"

        await session.commitTransaction();
        session.endSession();

        return res.json({ message: `Remove member successfully!` })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { userId, projectId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [project, user] = await Promise.all([
            Project.findById(projectId),
            User.findOneAndUpdate(
                { _id: userId, "projects.id": projectId },
                { $set: { "projects.$.role": role } }
            ).session(session)
        ])

        if (!user || !project) throw "Can not find user/project or user not a member in project"

        await session.commitTransaction()
        session.endSession()

        res.json({
            result: 'ok',
            message: `${user.name} is now ${role} of project: ${project.name}!`,
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()

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
    addMember,
    removeMember,
    changeUserRole
}