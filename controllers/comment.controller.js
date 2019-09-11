const Job = require('../models/job.model')
const Comment = require('../models/comment.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postComment = async (req, res, next) => {
    const { body, jobId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [comment] = await Comment.create(
                [{
                    body,
                    commentOn: jobId,
                    author: signedUser._id
                }], { session }
            )

            signedUser.comments.push(comment._id)

            const [job, user] = await Promise.all([
                Job.findByIdAndUpdate(
                    jobId,
                    { $addToSet: { comments: comment._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!job) throw 'Can not find job'

            res.json({ message: `Create comment successfully!`, comment })
        })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    const { commentId } = req.params
    const signedUser = req.user

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [comment, job, user] = await Promise.all([
                Comment.deleteOne({ _id: commentId, author: signedUser._id }),

                Job.updateOne(
                    { "comments.id": commentId },
                    { $pull: { comments: { id: commentId } } }
                ).session(session),

                User.updateOne(
                    { "comments.id": commentId },
                    { $pull: { comments: { id: commentId } } }
                ).session(session)
            ])

            if (!comment)
                throw "Can not find comment or user"

            res.json({ message: "Delete comment successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    const { commentId } = req.params
    const { body } = req.body
    const signedUser = req.user

    const query = {
        ...(body && { body }),
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const comment = await Comment.findByIdAndUpdate(
                commentId, query, { new: true }
            ).session(session)

            if (!comment) throw "Can not find comment"
            if (!comment.author.equals(signedUser._id)) {
                throw 'Only author can do this action'
            }

            res.json({ message: `Update comment ${comment.body} successfully!`, comment })
        })
    } catch (error) {
        next(error)
    }
}

const getComments = async (req, res, next) => {
    const { jobId } = req.query

    try {
        const comments = await Comment.find(
            { commentOn: jobId },
            "body commentOn createdAt"
        )

        if (!comments) throw "Can not show comment"

        res.json({ comments })
    } catch (error) {
        next(error)
    }
}

const getComment = async (req, res, next) => {
    const { commentId } = req.params

    try {
        const comment = await Comment.findById(commentId)

        if (!comment) throw "Wrong comment id"

        res.json({ comment })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postComment,
    deleteComment,
    updateComment,
    getComments,
    getComment
}