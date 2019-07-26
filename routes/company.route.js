const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller')

router.post('/add', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { name, address, emailDomain } = req.body
    try {
        let newCompany = await companyController.add({name, address, emailDomain}, tokenKey)
        res.json({
            result: 'ok',
            message: 'Add new company successfully!',
            data: newCompany
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Add new company failed. Error: ${error}`
        })
    }
})

router.get('/find-by-user-id/:id', async (req, res) => {
    let { id } = req.params
    try {
        let company = await companyController.findByUserId(id)
        res.json({
            result: 'ok',
            message: `Find company by user id: ${id} successfully!`,
            data: company
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Error: ${error}`
        })
    }
})

router.get('/show-members-by-id/:id', async (req, res) => {
    let { id } = req.params
    try {
        let company = await companyController.showMembersById(id)
        res.json({
            result: 'ok',
            message: `Get detail company successfully!`,
            data: company
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Error: ${error}`
        })
    }
})

module.exports = router