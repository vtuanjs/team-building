const GroupJob = require('../models/groupJob.model')
const Project = require('../models/project.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postGroupJob = async (req, res, next) => {
    const { title, description, projectId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [groupJob] = await GroupJob.create(
                [{
                    title,
                    description,
                    project: projectId,
                    members: [signedUser._id]
                }], { session}
            )
    
            signedUser.groupJobs.push({ id: groupJob._id, role: "author" })
    
            const [project, user] = await Promise.all([
                Project.findByIdAndUpdate(
                    projectId,
                    { $addToSet: { groupJobs: groupJob._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!project) throw 'Can not find project'
    
            res.json({ message: `Create groupJob successfully!`, groupJob })
        })
    } catch (error) {
        next(error)
    }
}

const setGroupJobInTrash = async (req, res, next) => {
    const { groupJobId } = req.params
    try {
        const groupJob = await GroupJob.findByIdAndUpdate(groupJobId, { isInTrash: 1 }, { upsert: true, new: true }).select('title isInTrash')

        if (!groupJob) throw "Can not find groupJob"

        res.json({ message: `Send groupJob ${groupJob.title} to trash successfully!`, groupJob })
    } catch (error) {
        next(error)
    }
}

const unsetGroupJobInTrash = async (req, res, next) => {
    const { groupJobId } = req.params
    try {
        const groupJob = await GroupJob.findByIdAndUpdate(groupJobId, { isInTrash: 0 }, { upsert: true, new: true }).select('isInTrash')

        if (!groupJob) throw "Can not find groupJob"

        res.json({ message: `Restore groupJob ${groupJob.title} successfully!`, groupJob })
    } catch (error) {
        next(error)
    }
}

const hiddenGroupJob = async (req, res, next) => {
    const { groupJobId } = req.params
    try {
        const groupJob = await GroupJob.findByIdAndUpdate(groupJobId, { isHidden: 1 }, { upsert: true, new: true }).select('isHidden')

        if (!groupJob) throw "Can not find groupJob"

        res.json({ message: `Hidden groupJob ${groupJob.title} successfully!`, groupJob })
    } catch (error) {
        next(error)
    }
}

const unHiddenGroupJob = async (req, res, next) => {
    const { groupJobId } = req.params
    try {
        const groupJob = await GroupJob.findByIdAndUpdate(groupJobId, { isHidden: 0 }, { upsert: true, new: true }).select('isHidden')

        if (!groupJob) throw "Can not find groupJob"

        res.json({ message: `Unhidden groupJob ${groupJob.title} successfully!`, groupJob })
    } catch (error) {
        next(error)
    }
}

const deleteGroupJob = async (req, res, next) => {
    const { groupJobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [groupJob, _] = await Promise.all([
                GroupJob.findByIdAndDelete(groupJobId).session(session),

                User.updateMany(
                    { "groupJobs.id": groupJobId },
                    { $pull: { groupJobs: { id: groupJobId } } }
                ).session(session)
            ])

            if (!groupJob)
                throw "Can not find groupJob or user"

            res.json({ message: "Delete groupJob successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updateGroupJob = async (req, res, next) => {
    const { groupJobId } = req.params
    const { title, description } = req.body

    const query = {
        ...(title && { title }),
        ...(description && { description }),
    }
    try {
        const groupJob = await GroupJob.findByIdAndUpdate(
            groupJobId, query, { new: true }
        )

        if (!groupJob) throw "Can not find groupJob"

        res.json({ message: `Update groupJob ${groupJob.title} successfully!`, groupJob })
    } catch (error) {
        next(error)
    }
}

const getGroupJobs = async (req, res, next) => {
    const { projectId } = req.query

    try {
        const groupJobs = await GroupJob.find(
            { project: projectId },
            "title createdAt"
        )

        if (!groupJobs) throw "Can not show groupJob"

        res.json({ groupJobs })
    } catch (error) {
        next(error)
    }
}

const getGroupJob = async (req, res, next) => {
    const { groupJobId } = req.params

    try {
        const groupJob = await GroupJob.findById(groupJobId)

        if (!groupJob) throw "Wrong groupJob id"

        res.json({ groupJob })
    } catch (error) {
        next(error)
    }
}

const addMembers = async (req, res, next) => {
    const { userIds } = req.body
    const { groupJobId } = req.params

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

            const [groupJob, _] = await Promise.all([
                GroupJob.findOneAndUpdate(
                    { _id: groupJobId },
                    { $addToSet: { members: { $each: validUserIds } } },
                    { new: true }
                ).select('members').session(session),

                User.updateMany(
                    { _id: { $in: validUserIds }, "groupJobs.id": { $ne: groupJobId } },
                    { $push: { groupJobs: { id: groupJobId, role: "employee" } } }
                ).session(session)
            ])

            if (!groupJob)
                throw "Can not find groupJob"

            return res.json({
                message: `Add member successfully!`, groupJob
            })
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const { groupJobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [groupJob, _] = await Promise.all([
                GroupJob.findByIdAndUpdate(groupJobId, { $pull: { members: userId } }, { new: true }).session(session),
                User.findByIdAndUpdate(userId, { $unset: { "groupJobs.id": groupJobId } }).session(session)
            ])

            if (!groupJob)
                throw "Can not find groupJob"

            return res.json({ message: `Remove member successfully!`, groupJob })
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { groupJobId } = req.params
    const { userId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [groupJob, user] = await Promise.all([
                GroupJob.findById(groupJobId),
                User.findOneAndUpdate(
                    { _id: userId, "groupJobs.id": groupJobId },
                    { $set: { "groupJobs.$.role": role } },
                    { new: true }
                ).session(session)
            ])

            if (!user || !groupJob) throw "Can not find user/groupJob or user not a member in groupJob"

            res.json({
                message: `${user.title} is now ${role}!`, user: { _id: user._id, groupJobs: user.groupJobs }
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postGroupJob,
    setGroupJobInTrash,
    unsetGroupJobInTrash,
    hiddenGroupJob,
    unHiddenGroupJob,
    deleteGroupJob,
    updateGroupJob,
    getGroupJobs,
    getGroupJob,
    addMembers,
    removeMember,
    changeUserRole
}