const mongoose = require('../database/database')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, default: "" },
    emailDomain: { type: String, lowercase: true, match: /^(([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    isHidden: {type: Number, default: 0},
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    limited: {
        projects: { type: Number, default: 1 },
        plants: { type: Number, default: 5 },
        jobs: { type: Number, default: 10 }
    }
}, {timestamps: true})

const Company = mongoose.model("Company", CompanySchema)
module.exports = Company