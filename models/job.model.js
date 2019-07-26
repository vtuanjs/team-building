const mongoose = require('../database/database')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    createdOn: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    plant: { type: Schema.Types.ObjectId, ref: "Plant" },
    comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
})

const Job = mongoose.model("Job", JobSchema)
module.exports = Job