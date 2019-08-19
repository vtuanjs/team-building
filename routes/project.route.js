const express = require('express')
const router = express.Router()
const projectController = require('../controllers/project.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    isAdmin, isCompanyMember, isCompanyManager,
    isProjectMember, isProjectAuthor, checkPermit
} = require('../middlewares/permistion.middleware')

// const getCompanyIdFromProjectId()

//Header: x-access-token-key
//Body: title, description, companyId
router.post('/add',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.body
        const permit = checkPermit(
            isAdmin(user),
            isCompanyManager(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    projectController.add)

//Header: x-access-token-key
//Query: companyId
router.get('/find-all-in-company/:companyId',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.params
        const permit = checkPermit(
            isCompanyMember(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    projectController.findAllInCompany
)

// Header: x-access-token-key
// Body: projectId, title, description, companyId
router.put('/update',
    authentication.required,
    async (req, res, next) => {
        try {
            const { user } = req
            const project = await projectController.findProject(req.body.projectId)
            if (!project) return next("Can not find project")
            const permit = checkPermit(
                isCompanyManager(user, project.company),
                isProjectAuthor(user, req.body.projectId)
            )
            if (permit) return next()
            else return next("You don't have authorization to do this action!")
        } catch (error) {
            next(error)
        }
    },
    projectController.update
)

// Header: x-access-token-key
//Param: projectId
router.get('/get-list-users/:projectId',
    authentication.required,
    async (req, res, next) => {
        try {
            const { user } = req
            const project = await projectController.findProject(req.params.projectId)
            if (!project) return next("Can not find project")
            const permit = checkPermit(
                isCompanyMember(user, project.company)
            )
            if (permit) return next()
            else return next("You don't have authorization to do this action!")
        } catch (error) {
            next(error)
        }
    },
    projectController.getListUsersByProjectId
)

router.post('/add-member', projectController.addMember)

module.exports = router