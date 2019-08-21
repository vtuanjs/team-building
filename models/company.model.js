const mongoose = require('../database/database')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, default: "" },
    emailDomain: { type: String, lowercase: true, match: /^(([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    isClosed: { type: Number, default: 0 },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

const vipVirtual = CompanySchema.virtual("vip")

vipVirtual.set(value => {
    value = value.trim().toLowerCase()

    switch (value) {
        case "vip1":
            this.limited = {
                members: 100,
                teams: 10,
                space: 100,
                projects: 9999,
                plants: 9999,
                jobs: 9999,
                lastUpgradeVip: Date.now()
            }
            break
        case "vip2":
            this.limited = {
                members: 200,
                teams: 30,
                space: 1000,
                projects: 9999,
                plants: 9999,
                jobs: 9999,
                lastUpgradeVip: Date.now()
            }
            break
        case "vip3":
            this.limited = {
                members: 9999,
                teams: 9999,
                space: 5000,
                projects: 9999,
                plants: 9999,
                jobs: 9999,
                lastUpgradeVip: Date.now()
            }
            break
        default:
            this.limited = {
                members: 10,
                teams: 2,
                space: 5,
                projects: 1,
                plants: 5,
                jobs: 20,
                lastUpgradeVip: Date.now()
            }
            break
    }
})

vipVirtual.get(() => {
    return {
        "limited members": this.limited.members,
        "limited teams": this.limited.teams,
        "limited space": this.limited.space,
        "limited projects": this.limited.projects,
        "limited plants": this.limited.plants,
        "limited jobs": this.limited.jobs,
        "last upgrade vip": this.lastUpgradeVip
    }
})

const Company = mongoose.model("Company", CompanySchema)
module.exports = Company