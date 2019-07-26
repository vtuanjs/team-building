const mongoose = require('../database/database')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: " "},
    createdOn: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    company: {type: Schema.Types.ObjectId, ref: "Company"},
    plants: [{ type: Schema.Types.ObjectId, ref: "Plant" }]
})

const Project = mongoose.model("Project", ProjectSchema)
module.exports = Project