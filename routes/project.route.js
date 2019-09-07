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
    project.getProjects
)

router.get('/:projectId',
    authentication.required,
    checkPermit(inUser('admin'), inCompany('self', 'employee')),
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

router.post('/:projectId/change-user-role',
    authentication.required,
    checkPermit(inUser("admin"), inCompany('self', 'manager')),
    project.changeUserRole
)

router.post('/:projectId/move-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inProject('self', 'author')),
    project.setProjectInTrash
)

router.post('/:projectId/unmove-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inProject('self', 'author')),
    project.unsetProjectInTrash
)

router.post('/:projectId/hidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inProject('self', 'author')),
    project.hiddenProject
)

router.post('/:projectId/unhidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inProject('self', 'author')),
    project.unHiddenProject
)

router.post('/:projectId/delete',
    authentication.required,
    checkPermit(inCompany('self', 'manager')),
    project.deleteProject
)

router.post('/:projectId/add-members',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inProject("self", "employee")),
    project.addMembers
)

router.post('/:projectId/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    project.removeMember
)

module.exports = router