const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const SubJobSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    isInTrash: {type: Number, default: 0},
    members: [{ type: ObjectId, ref: "User" }],
    job: { type: ObjectId, ref: "Job" },
    comment: [{ type: ObjectId, ref: "Comment" }]
}, {timestamps: true, autoCreate: true})

const SubJob = mongoose.model("SubJob", SubJobSchema)
module.exports = SubJob