const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const JobSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    isInTrash: {type: Number, default: 0},
    members: [{ type: ObjectId, ref: "User" }],
    plant: { type: ObjectId, ref: "Plant" },
    comment: [{ type: ObjectId, ref: "Comment" }]
}, {timestamps: true, autoCreate: true})

const Job = mongoose.model("Job", JobSchema)
module.exports = Job