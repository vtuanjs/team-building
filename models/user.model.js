const mongoose = require('../database/database')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: { type: String, lowercase: true, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    name: { type: String, default: ""},
    gender: { type: String, enum: ["male", "female", "N/A"], default: "N/A"},
    phone: { type: String, default: "N/A"},
    address: { type: String, default: "N/A"},
    password: { type: String, required: true },
    role: { type: String, default: "user" }, //admin, manager, secret, user
    isActive: { type: Number, default: 1},
    isBanned: { type: Number, default: 0 }, //1: banned
    company: {type: Schema.Types.ObjectId, ref: "Company" },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    projects: [{type: Schema.Types.ObjectId, ref: "Project"}],
    plants: [{type: Schema.Types.ObjectId, ref: "Plant"}],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)
module.exports = User