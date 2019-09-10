const SubJob = require('../models/subJob.model')
const Job = require('../models/job.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postSubJob = async (req, res, next) => {
    const { title, description, jobId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [subJob] = await SubJob.create(
                [{
                    title,
                    description,
                    job: jobId,
                    members: [signedUser._id]
                }], { session}
            )
    
            signedUser.subJobs.push({ id: subJob._id, role: "author" })
    
            const [job, user] = await Promise.all([
                Job.findByIdAndUpdate(
                    jobId,
                    { $addToSet: { subJobs: subJob._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!job) throw 'Can not find job'
    
            res.json({ message: `Create subJob successfully!`, subJob })
        })
    } catch (error) {
        next(error)
    }
}

const setSubJobInTrash = async (req, res, next) => {
    const { subJobId } = req.params
    try {
        const subJob = await SubJob.findByIdAndUpdate(subJobId, { isInTrash: 1 }, { upsert: true, new: true }).select('title isInTrash')

        if (!subJob) throw "Can not find subJob"

        res.json({ message: `Send subJob ${subJob.title} to trash successfully!`, subJob })
    } catch (error) {
        next(error)
    }
}

const unsetSubJobInTrash = async (req, res, next) => {
    const { subJobId } = req.params
    try {
        const subJob = await SubJob.findByIdAndUpdate(subJobId, { isInTrash: 0 }, { upsert: true, new: true }).select('isInTrash')

        if (!subJob) throw "Can not find subJob"

        res.json({ message: `Restore subJob ${subJob.title} successfully!`, subJob })
    } catch (error) {
        next(error)
    }
}

const hiddenSubJob = async (req, res, next) => {
    const { subJobId } = req.params
    try {
        const subJob = await SubJob.findByIdAndUpdate(subJobId, { isHidden: 1 }, { upsert: true, new: true }).select('isHidden')

        if (!subJob) throw "Can not find subJob"

        res.json({ message: `Hidden subJob ${subJob.title} successfully!`, subJob })
    } catch (error) {
        next(error)
    }
}

const unHiddenSubJob = async (req, res, next) => {
    const { subJobId } = req.params
    try {
        const subJob = await SubJob.findByIdAndUpdate(subJobId, { isHidden: 0 }, { upsert: true, new: true }).select('isHidden')

        if (!subJob) throw "Can not find subJob"

        res.json({ message: `Unhidden subJob ${subJob.title} successfully!`, subJob })
    } catch (error) {
        next(error)
    }
}

const deleteSubJob = async (req, res, next) => {
    const { subJobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [subJob, _] = await Promise.all([
                SubJob.findByIdAndDelete(subJobId).session(session),

                User.updateMany(
                    { "subJobs.id": subJobId },
                    { $pull: { subJobs: { id: subJobId } } }
                ).session(session)
            ])

            if (!subJob)
                throw "Can not find subJob or user"

            res.json({ message: "Delete subJob successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updateSubJob = async (req, res, next) => {
    const { subJobId } = req.params
    const { title, description } = req.body

    const query = {
        ...(title && { title }),
        ...(description && { description }),
    }
    try {
        const subJob = await SubJob.findByIdAndUpdate(
            subJobId, query, { new: true }
        )

        if (!subJob) throw "Can not find subJob"

        res.json({ message: `Update subJob ${subJob.title} successfully!`, subJob })
    } catch (error) {
        next(error)
    }
}

const getSubJobs = async (req, res, next) => {
    const { jobId } = req.query

    try {
        const subJobs = await SubJob.find(
            { job: jobId },
            "title createdAt"
        )

        if (!subJobs) throw "Can not show subJob"

        res.json({ subJobs })
    } catch (error) {
        next(error)
    }
}

const getSubJob = async (req, res, next) => {
    const { subJobId } = req.params

    try {
        const subJob = await SubJob.findById(subJobId)

        if (!subJob) throw "Wrong subJob id"

        res.json({ subJob })
    } catch (error) {
        next(error)
    }
}

const addMembers = async (req, res, next) => {
    const { userIds } = req.body
    const { subJobId } = req.params

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

            const [subJob, _] = await Promise.all([
                SubJob.findOneAndUpdate(
                    { _id: subJobId },
                    { $addToSet: { members: { $each: validUserIds } } },
                    { new: true }
                ).select('members').session(session),

                User.updateMany(
                    { _id: { $in: validUserIds }, "subJobs.id": { $ne: subJobId } },
                    { $push: { subJobs: { id: subJobId, role: "employee" } } }
                ).session(session)
            ])

            if (!subJob)
                throw "Can not find subJob"

            return res.json({
                message: `Add member successfully!`, subJob
            })
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const { subJobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [subJob, _] = await Promise.all([
                SubJob.findByIdAndUpdate(subJobId, { $pull: { members: userId } }, { new: true }).session(session),
                User.findByIdAndUpdate(userId, { $unset: { "subJobs.id": subJobId } }).session(session)
            ])

            if (!subJob)
                throw "Can not find subJob"

            return res.json({ message: `Remove member successfully!`, subJob })
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { subJobId } = req.params
    const { userId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [subJob, user] = await Promise.all([
                SubJob.findById(subJobId),
                User.findOneAndUpdate(
                    { _id: userId, "subJobs.id": subJobId },
                    { $set: { "subJobs.$.role": role } },
                    { new: true }
                ).session(session)
            ])

            if (!user || !subJob) throw "Can not find user/subJob or user not a member in subJob"

            res.json({
                message: `${user.title} is now ${role}!`, user: { _id: user._id, subJobs: user.subJobs }
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postSubJob,
    setSubJobInTrash,
    unsetSubJobInTrash,
    hiddenSubJob,
    unHiddenSubJob,
    deleteSubJob,
    updateSubJob,
    getSubJobs,
    getSubJob,
    addMembers,
    removeMember,
    changeUserRole
}