const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const UserSchema = new Schema({
    email: { type: String, lowercase: true, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    name: { type: String, default: ""},
    gender: { type: String, enum: ["male", "female", "N/A"], default: "N/A"},
    phone: { type: String, default: "N/A"},
    address: { type: String, default: "N/A"},
    password: { type: String, required: true },
    role: { type: String, default: "user" }, //admin, user
    isActive: { type: Number, default: 1},
    isBanned: { type: Number, default: 0 }, //1: banned
    company: {
        id: {type: ObjectId, ref: "Company" },
        role: {type: String, default: "employee"},
        _id: false
    },
    projects: [{
        id: {type: ObjectId, ref: "Project" },
        role: {type: String, default: "employee"},
        _id: false
    }],
    groupJobs: [{
        id: {type: ObjectId, ref: "GroupJob" },
        role: {type: String, default: "employee"},
        _id: false
    }],
    jobs: [{
        id: {type: ObjectId, ref: "Job" },
        role: {type: String, default: "employee"},
        _id: false
    }],
    subJobs: [{
        id: {type: ObjectId, ref: "SubJob" },
        role: {type: String, default: "employee"},
        _id: false
    }],
    team: {
        id: {type: ObjectId, ref: "Team" },
        role: {type: String, default: "employee"},
        _id: false
    },
    comments: [{ type: ObjectId, ref: "Comment" }]
}, {timestamps: true, autoCreate: true})

const User = mongoose.model('User', UserSchema)
module.exports = User