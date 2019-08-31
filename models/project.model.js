const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: " "},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    isInTrash: {type: Number, default: 0},
    author: { type: ObjectId, ref: "User"},
    members: [{ type: ObjectId, ref: "User"}],
    company: {type: ObjectId, ref: "Company"},
    plants: [{ type: ObjectId, ref: "Plant" }]
}, {timestamps: true})

const Project = mongoose.model("Project", ProjectSchema)
module.exports = Project