const express = require('express')
const router = express.Router()
const groupJob = require('../controllers/groupJob.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inProject, inGroupJob, inUser, inCompany } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inProject('body', 'employee')),
    groupJob.postGroupJob
)
router.get('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inProject('query', 'employee')),
    groupJob.getGroupJobs
)

router.get('/:groupJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inGroupJob('body', 'employee')),
    groupJob.getGroupJob
)
router.put('/:groupJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inGroupJob('body', 'author')),
    groupJob.updateGroupJob
)
router.delete('/:groupJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inGroupJob('body', 'author')),
    groupJob.deleteGroupJob
)

router.post('/:groupJobId/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inGroupJob('body', 'manager')),
    groupJob.changeUserRole
)

router.post('/:groupJobId/move-to-trash',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inGroupJob('body', 'author'), ),
    groupJob.setGroupJobInTrash
)

router.post('/:groupJobId/unmove-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inGroupJob('self', 'author')),
    groupJob.unsetGroupJobInTrash
)

router.post('/:groupJobId/hidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inGroupJob('self', 'author')),
    groupJob.hiddenGroupJob
)

router.post('/:groupJobId/unhidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inGroupJob('self', 'author')),
    groupJob.unHiddenGroupJob
)

router.delete('/:groupJobId/delete',
    authentication.required,
    checkPermit(inCompany('self', 'manager')),
    groupJob.deleteGroupJob
)

router.post('/:groupJobId/add-members',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inGroupJob("self", "employee")),
    groupJob.addMembers
)

router.post('/:groupJobId/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    groupJob.removeMember
)

module.exports = router