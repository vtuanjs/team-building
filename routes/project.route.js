const express = require('express')
const router = express.Router()
const project = require('../controllers/project.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inProject, inUser, inCompany } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    project.postProject
)
router.get('/',
    authentication.required,
    checkPermit(inUser("admin")),
    project.getProjects
)

router.get('/:projectId',
    authentication.required,
    project.getProject
)
router.put('/:projectId',
    authentication.required,
    checkPermit(inProject("body", "manager")),
    project.updateProject
)
router.delete('/:projectId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inProject("self", "author")),
    project.deleteProject
)

router.post('/change-user-role',
    authentication.required,
    checkPermit(inUser("admin")),
    project.changeUserRole
)

router.post('/add-member',
    authentication.required,
    checkPermit(inUser("admin"), inProject("self", "employee")),
    project.addMember
)

router.post('/remove-member',
    authentication.required,
    checkPermit(inProject("self", "manager")),
    project.removeMember
)

module.exports = router