const mongoose = require('../database/database')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: " "},
    isHidden: {type: Number, default: 0},
    isClosed: {type: Number, default: 0},
    members: [{ type: Schema.Types.ObjectId, ref: "User"}],
    company: {type: Schema.Types.ObjectId, ref: "Company"},
    plants: [{ type: Schema.Types.ObjectId, ref: "Plant" }]
}, {timestamps: true})

const Project = mongoose.model("Project", ProjectSchema)
module.exports = Project