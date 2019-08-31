const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const PlantSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    isInTrash: {type: Number, default: 0},
    author: { type: ObjectId, ref: "User"},
    members: [{ type: ObjectId, ref: "User" }],
    project: { type: ObjectId, ref: "Project" },
    jobs: [{ type: ObjectId, ref: "Job" }]
}, {timestamps: true})

const Plant = mongoose.model("Plant", PlantSchema)
module.exports = Plant