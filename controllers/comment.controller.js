const Job = require('../models/job.model')
const Comment = require('../models/comment.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postJob = async (req, res, next) => {
    const { title, description, groupJobId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [job] = await Job.create(
                [{
                    title,
                    description,
                    groupJob: groupJobId,
                    members: [signedUser._id]
                }], { session}
            )
    
            signedUser.jobs.push({ id: job._id, role: "author" })
    
            const [groupJob, user] = await Promise.all([
                GroupJob.findByIdAndUpdate(
                    groupJobId,
                    { $addToSet: { jobs: job._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!groupJob) throw 'Can not find groupJob'
    
            res.json({ message: `Create job successfully!`, job })
        })
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
    const { groupJobId } = req.query

    try {
        const jobs = await Job.find(
            { groupJob: groupJobId },
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

module.exports = {
    postJob,
    deleteJob,
    updateJob,
    getJobs,
    getJob
}