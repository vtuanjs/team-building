const mongoose = require('../database/database')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, default: ""},
    isHidden: {type: Number, default: 0},
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    plant: { type: Schema.Types.ObjectId, ref: "Plant" },
    comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, {timestamps: true})

const Job = mongoose.model("Job", JobSchema)
module.exports = Job