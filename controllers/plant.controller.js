const Plant = require('../models/plant.model')
const Project = require('../models/project.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

const postPlant = async (req, res, next) => {
    const { title, description, projectId } = req.body
    const signedUser = req.user
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [plant] = await Plant.create(
                [{
                    title,
                    description,
                    project: projectId,
                    members: [signedUser._id]
                }], { session}
            )
    
            signedUser.plants.push({ id: plant._id, role: "author" })
    
            const [project, user] = await Promise.all([
                Project.findByIdAndUpdate(
                    projectId,
                    { $addToSet: { plants: plant._id } }
                ).session(session),
                signedUser.save()
            ])

            if (!project) throw 'Can not find project'
    
            res.json({ message: `Create plant successfully!`, plant })
        })
    } catch (error) {
        next(error)
    }
}

const setPlantInTrash = async (req, res, next) => {
    const { plantId } = req.params
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, { isInTrash: 1 }, { upsert: true, new: true }).select('title isInTrash')

        if (!plant) throw "Can not find plant"

        res.json({ message: `Send plant ${plant.title} to trash successfully!`, plant })
    } catch (error) {
        next(error)
    }
}

const unsetPlantInTrash = async (req, res, next) => {
    const { plantId } = req.params
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, { isInTrash: 0 }, { upsert: true, new: true }).select('isInTrash')

        if (!plant) throw "Can not find plant"

        res.json({ message: `Restore plant ${plant.title} successfully!`, plant })
    } catch (error) {
        next(error)
    }
}

const hiddenPlant = async (req, res, next) => {
    const { plantId } = req.params
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, { isHidden: 1 }, { upsert: true, new: true }).select('isHidden')

        if (!plant) throw "Can not find plant"

        res.json({ message: `Hidden plant ${plant.title} successfully!`, plant })
    } catch (error) {
        next(error)
    }
}

const unHiddenPlant = async (req, res, next) => {
    const { plantId } = req.params
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, { isHidden: 0 }, { upsert: true, new: true }).select('isHidden')

        if (!plant) throw "Can not find plant"

        res.json({ message: `Unhidden plant ${plant.title} successfully!`, plant })
    } catch (error) {
        next(error)
    }
}

const deletePlant = async (req, res, next) => {
    const { plantId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [plant, _] = await Promise.all([
                Plant.findByIdAndDelete(plantId).session(session),

                User.updateMany(
                    { "plants.id": plantId },
                    { $pull: { plants: { id: plantId } } }
                ).session(session)
            ])

            if (!plant)
                throw "Can not find plant or user"

            res.json({ message: "Delete plant successfully!" })
        })
    } catch (error) {
        next(error)
    }
}

const updatePlant = async (req, res, next) => {
    const { plantId } = req.params
    const { title, description } = req.body

    const query = {
        ...(title && { title }),
        ...(description && { description }),
    }
    try {
        const plant = await Plant.findByIdAndUpdate(
            plantId, query, { new: true }
        )

        if (!plant) throw "Can not find plant"

        res.json({ message: `Update plant ${plant.title} successfully!`, plant })
    } catch (error) {
        next(error)
    }
}

const getPlants = async (req, res, next) => {
    const { projectId } = req.query

    try {
        const plants = await Plant.find(
            { project: projectId },
            "title createdAt"
        )

        if (!plants) throw "Can not show plant"

        res.json({ plants })
    } catch (error) {
        next(error)
    }
}

const getPlant = async (req, res, next) => {
    const { plantId } = req.params

    try {
        const plant = await Plant.findById(plantId)

        if (!plant) throw "Wrong plant id"

        res.json({ plant })
    } catch (error) {
        next(error)
    }
}

const addMembers = async (req, res, next) => {
    const { userIds } = req.body
    const { plantId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            let arrayUserIds = userIds
            if (typeof userIds === 'string') {
                arrayUserIds = userIds.split(',').map(item => {
                    return item.trim()
                })
            }

            const users = await User.find({ _id: { $in: arrayUserIds } })

            if (users.length === 0) throw "Can not find any user"

            const validUserIds = users.map(user => user._id)

            const [plant, _] = await Promise.all([
                Plant.findOneAndUpdate(
                    { _id: plantId },
                    { $addToSet: { members: { $each: validUserIds } } },
                    { new: true }
                ).select('members').session(session),

                User.updateMany(
                    { _id: { $in: validUserIds }, "plants.id": { $ne: plantId } },
                    { $push: { plants: { id: plantId, role: "employee" } } }
                ).session(session)
            ])

            if (!plant)
                throw "Can not find plant"

            return res.json({
                message: `Add member successfully!`, plant
            })
        })
    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    const { userId } = req.body
    const { plantId } = req.params

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [plant, _] = await Promise.all([
                Plant.findByIdAndUpdate(plantId, { $pull: { members: userId } }, { new: true }).session(session),
                User.findByIdAndUpdate(userId, { $unset: { "plants.id": plantId } }).session(session)
            ])

            if (!plant)
                throw "Can not find plant"

            return res.json({ message: `Remove member successfully!`, plant })
        })
    } catch (error) {
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    const { plantId } = req.params
    const { userId, role } = req.body
    const signedUser = req.user

    if (signedUser.role != "admin" && role === "admin") {
        //Only admin can make user become admin. If not, role = manager
        role = "manager"
    }

    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const [plant, user] = await Promise.all([
                Plant.findById(plantId),
                User.findOneAndUpdate(
                    { _id: userId, "plants.id": plantId },
                    { $set: { "plants.$.role": role } },
                    { new: true }
                ).session(session)
            ])

            if (!user || !plant) throw "Can not find user/plant or user not a member in plant"

            res.json({
                message: `${user.title} is now ${role}!`, user: { _id: user._id, plants: user.plants }
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postPlant,
    setPlantInTrash,
    unsetPlantInTrash,
    hiddenPlant,
    unHiddenPlant,
    deletePlant,
    updatePlant,
    getPlants,
    getPlant,
    addMembers,
    removeMember,
    changeUserRole
}