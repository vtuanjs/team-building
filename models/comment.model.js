const mongoose = require('../database/database')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    body: {type: String, default: ""},
    createdOn: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    commentOn: { type: Schema.Types.ObjectId, ref: 'Job' },
}, {timestamps: true})

const Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment 