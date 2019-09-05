const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const CompanySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, default: "" },
    emailDomain: { type: String, lowercase: true, match: /^(([\w-]+\.)+[\w-]{2,4})?$/, unique: true },
    projects: [{ type: ObjectId, ref: "Project" }],
    members: [{ type: ObjectId, ref: "User" }],
    limited: {
        members: { type: Number, default: 10 },
        teams: { type: Number, default: 2 },
        space: { type: Number, default: 5 },
        projects: { type: Number, default: 1 },
        plants: { type: Number, default: 5 },
        jobs: { type: Number, default: 20 },
    },
    lastUpgradeVip: { type: Date, default: Date.now }
}, { timestamps: true })

const Company = mongoose.model("Company", CompanySchema)
module.exports = Company