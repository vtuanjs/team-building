const mongoose = require('../database/database')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    name: { type: String, default: ""},
    password: { type: String, required: true },
    permission: { type: Number, default: 0 }, //0: user, 1: moderator, 2: admin
    isActive: { type: Number, default: 1},
    isBanned: { type: Number, default: 0 }, //1: banned
    createdOn: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    company: {
        id: { type: Schema.Types.ObjectId, ref: "Company" },
        userPermission: { type: Number, default: 0} //0: user, 1: manager
    },
    team: {
        id: { type: Schema.Types.ObjectId, ref: "Team" },
        userPermission: { type: Number, default: 0}
    },
    projects: [{
        id: { type: Schema.Types.ObjectId, ref: "Project" },
        userPermission: { type: Number, default: 0}
    }],
    plants: [{
        id: { type: Schema.Types.ObjectId, ref: "Plant" },
        userPermission: { type: Number, default: 0}
    }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User