const Job = require('../models/job.model')
const Plant = require('../models/plant.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postJob = async (req, res, next) => {
    const { title, description, plantId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [job] = await Job.create(
                [{
                    title,
                    description,
                    plant: plantId,
                    members: [signedUser._id]
                }], { session}
            )
    
            signedUser.jobs.push({ id: job._id, role: "author" })
    
            const [plant, user] = await Promise.all([
                Plant.findByIdAndUpdate(
                    plantId,
                    { $addToSet: { jobs: job._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!plant) throw 'Can not find plant'
    
            res.json({ message: `Create job successfully!`, job })
        })
    } catch (error) {
        next(error)
    }
}

const setJobInTrash = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findByIdAndUpdate(jobId, { isInTrash: 1 }, { upsert: true, new: true }).select('title isInTrash')

        if (!job) throw "Can not find job"

        res.json({ message: `Send job ${job.title} to trash successfully!`, job })
    } catch (error) {
        next(error)
    }
}

const unsetJobInTrash = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findByIdAndUpdate(jobId, { isInTrash: 0 }, { upsert: true, new: true }).select('isInTrash')

        if (!job) throw "Can not find job"

        res.json({ message: `Restore job ${job.title} successfully!`, job })
    } catch (error) {
        next(error)
    }
}

const hiddenJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findByIdAndUpdate(jobId, { isHidden: 1 }, { upsert: true, new: true }).select('isHidden')

        if (!job) throw "Can not find job"

        res.json({ message: `Hidden job ${job.title} successfully!`, job })
    } catch (error) {
        next(error)
    }
}

const unHiddenJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findByIdAndUpdate(jobId, { isHidden: 0 }, { upsert: true, new: true }).select('isHidden')

        if (!job) throw "Can not find job"

        res.json({ message: `Unhidden job ${job.title} successfully!`, job })
    } catch (error) {
        next(error)
    }
}

const deleteJob = async (req, res, next) => {
    const { jobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [job, _] = await Promise.all([
                Job.findByIdAndDelete(jobId).session(session),

                User.updateMany(
                    { "jobs.id": jobId },
                    { $pull: { jobs: { id: jobId } } }
                ).session(session)
            ])

            if (!job)
                throw "Can not find job or user"

            res.json({ message: "Delete job successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updateJob = async (req, res, next) => {
    const { jobId } = req.params
    const { title, description } = req.body

    const query = {
        ...(title && { title }),
        ...(description && { description }),
    }
    try {
        const job = await Job.findByIdAndUpdate(
            jobId, query, { new: true }
        )

        if (!job) throw "Can not find job"

        res.json({ message: `Update job ${job.title} successfully!`, job })
    } catch (error) {
        next(error)
    }
}

const getJobs = async (req, res, next) => {
    const { plantId } = req.query

    try {
        const jobs = await Job.find(
            { plant: plantId },
            "title createdAt"
        )

        if (!jobs) throw "Can not show job"

        res.json({ jobs })
    } catch (error) {
        next(error)
    }
}

const getJob = async (req, res, next) => {
    const { jobId } = req.params

    try {
        const job = await Job.findById(jobId)

        if (!job) throw "Wrong job id"

        res.json({ job })
    } catch (error) {
        next(error)
    }
}

const addMembers = async (req, res, next) => {
    const { userIds } = req.body
    const { jobId } = req.params

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

            const [job, _] = await Promise.all([
                Job.findOneAndUpdate(
                    { _id: jobId },
                    { $addToSet: { members: { $each: validUserIds } } },
                    { new: true }
                ).select('members').session(session),

                User.updateMany(
                    { _id: { $in: validUserIds }, "jobs.id": { $ne: jobId } },
                    { $push: { jobs: { id: jobId, role: "employee" } } }
                ).session(session)
            ])

            if (!job)
                throw "Can not find job"

            return res.json({
                message: `Add member successfully!`, job
            })
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const { jobId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [job, _] = await Promise.all([
                Job.findByIdAndUpdate(jobId, { $pull: { members: userId } }, { new: true }).session(session),
                User.findByIdAndUpdate(userId, { $unset: { "jobs.id": jobId } }).session(session)
            ])

            if (!job)
                throw "Can not find job"

            return res.json({ message: `Remove member successfully!`, job })
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { jobId } = req.params
    const { userId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [job, user] = await Promise.all([
                Job.findById(jobId),
                User.findOneAndUpdate(
                    { _id: userId, "jobs.id": jobId },
                    { $set: { "jobs.$.role": role } },
                    { new: true }
                ).session(session)
            ])

            if (!user || !job) throw "Can not find user/job or user not a member in job"

            res.json({
                message: `${user.title} is now ${role}!`, user: { _id: user._id, jobs: user.jobs }
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postJob,
    setJobInTrash,
    unsetJobInTrash,
    hiddenJob,
    unHiddenJob,
    deleteJob,
    updateJob,
    getJobs,
    getJob,
    addMembers,
    removeMember,
    changeUserRole
}