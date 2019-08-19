const Plant = require('../models/plant.model')
const Company = require('../models/company.model')
const Project = require('../models/project.model')

const add = async (req, res, next) => {
    const signedInUser = req.user
    const { title, description, plantId } = req.body
    try {
        const company = await Company.findById(signedInUser.company.id)
        const countPlantInProject = await Plant.countDocuments({ plant: plantId })
        if (countPlantInProject >= company.limited.plants) {
            throw "Your company is limited add new plant to plant, please upggrade your account"
        }
        const newPlant = await Plant.create({
            title,
            description,
            plant: plantId,
            members: [signedInUser._id]
        })
        Promise.all([
            Project.updateOne({ _id: plantId }, {
                $push: { plants: newPlant._id }
            }),
            signedInUser.updateOne({ plants: [...signedInUser.plants, { id: newPlant._id, role: "author" }] }),
            res.json({
                result: 'ok',
                message: 'Add new plant successfully!',
                data: newPlant
            })
        ])
    } catch (error) {
        next(error)
    }
}

const findAllInProject = async (req, res, next) => {
    const { plantId } = req.params
    try {
        const plants = await Plant.find({ plant: plantId })
            .select("title description createdAt")
        if (!plants) throw "Can not find plants in this plant"
        res.json({
            result: "ok",
            message: "Find plants in plant successfully!",
            data: plants
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    const { plantId, title, description } = req.body
    try {
        const plant = await Plant.findById(plantId)
        if (!plant)
            throw `Can not find plant`
        const query = {
            ...(title && { title }),
            ...(description && { description }),
        }
        await plant.updateOne(query, { new: true })
        res.json({
            result: 'ok',
            message: `Update plant with ID: ${plantId} succesfully!`,
        })
    } catch (error) {
        next("Update error: " + error)
    }
}

const addMember = async (req, res, next) => {
    const { userId, companyId } = req.params
    
    
}

const makeMemberBecomeManager = async (req, res, next) => {
    const { userId, companyId } = req.params
    
    
}

const makeManagerBecomeMember = async (req, res, next) => {
    const { userId, companyId } = req.params
    
    
}

const RemoveMember = async (req, res, next) => {
    const { userId, companyId } = req.params
    
    
}

module.exports = {
    add,
    update,
    findAllInProject,
}