const mongoose = require('../database/database')
const Schema = mongoose.Schema

const TeamSchema = new Schema({
    name: { type: String, required: true },
    createdOn: { type: Date, default: Date.now},
    lastUpdated: { type: Date, default: Date.now },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }]
})

const Team = mongoose.model('Team', TeamSchema)
module.exports = Team