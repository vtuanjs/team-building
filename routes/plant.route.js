const express = require('express')
const router = express.Router()
const plantController = require('../controllers/plant.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    isAdmin, isCompanyMember, isCompanyManager,
    isProjectMember, isProjectManager, checkPermit
} = require('../middlewares/permistion.middleware')

router.post('/add', authentication.required, plantController.add)

router.get('/find-all-in-project/:projectId', plantController.findAllInProject)

router.put('/update', authentication.required , plantController.update)

module.exports = router