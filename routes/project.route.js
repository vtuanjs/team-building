const express = require('express')
const router = express.Router()
const projectController = require('../controllers/project.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    isAdmin, isCompanyMember, isCompanyManager,
    isProjectMember, isProjectManager, checkPermit
} = require('../middlewares/permistion.middleware')

// const getCompanyIdFromProjectId()

//Header: x-access-token-key
//Body: title, description, companyId
router.post('/add',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.body
        checkPermit(
            isAdmin(user),
            isCompanyManager(user, companyId)
        )(next)
    },
    projectController.add)

//Header: x-access-token-key
//Query: companyId
router.get('/find-all-in-company/',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.body
        checkPermit(
            isCompanyMember(user, companyId)
        )(next)
    },
    projectController.findAllInCompany
)

// Header: x-access-token-key
// Body: projectId, title, description, companyId
router.put('/update',
    authentication.required,
    (req, res, next) => {
        let { user } = res.locals
        let { projectId } = req.body
        let companyId = projectController.getCompanyIdFromProjectId(projectId, next)
        checkPermit(
            isCompanyManager(user, companyId)
        )(next)
    },
    projectController.update
)

router.get('/get-list-users/:projectId',
    authentication.required,
    (req, res, next) => {
        let { user } = res.locals
        let { projectId } = req.params
        let companyId = projectController.getCompanyIdFromProjectId(projectId, next)
        checkPermit(
            isCompanyManager(user, companyId)
        )(next)
    },
    projectController.getListUsersByProjectId
)

module.exports = router