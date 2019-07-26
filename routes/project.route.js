const express = require('express')
const router = express.Router()
const projectController = require('../controllers/project.controller')

router.post('/add', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { title, description, companyId } = req.body
    try {
        let newProject = await projectController.add({title, description}, companyId, tokenKey)
        res.json({
            result: 'ok',
            message: 'Add new project successfully!',
            data: newProject
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Add new project failed. Error: ${error}`
        })
    }
})

router.get('/find-all-in-company/:companyId', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { companyId } = req.params
    try {
        let projects = await projectController.findAllInCompany(companyId, tokenKey)
        res.json({
            result: 'ok',
            message: `Find all projects successfully!`,
            data: projects
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Error: ${error}`
        })
    }
})

router.put('/update', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { id, title, description } = req.body
    try {
        let projects = await projectController.update(id, {title, description}, tokenKey)
        res.json({
            result: 'ok',
            message: `Update projects successfully!`,
            data: projects
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Error: ${error}`
        })
    }
})

module.exports = router