const mongoose = require('../database/database')
const Schema = mongoose.Schema

const PlantSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    author: { type: Schema.Types.ObjectId, ref: "User"},
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }]
}, {timestamps: true})

const Plant = mongoose.model("Plant", PlantSchema)
module.exports = Plant