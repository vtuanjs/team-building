const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const CommentSchema = new Schema({
    body: {type: String, default: ""},
    createdOn: { type: Date, default: Date.now },
    author: { type: ObjectId, ref: "User" },
    commentOn: { type: ObjectId, ref: 'Job' },
}, {timestamps: true})

const Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment 