const mongoose = require('../database/database')
const Schema = mongoose.Schema

const PlantSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    createdOn: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }]
})

const Plant = mongoose.model("Plant", PlantSchema)
module.exports = Plant