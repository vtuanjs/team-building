const express = require('express')
const router = express.Router()
const subJob = require('../controllers/subJob.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inJob, inSubJob, inUser, inCompany } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'employee')),
    subJob.postSubJob
)

router.get('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('query', 'employee')),
    subJob.getSubJobs
)

router.get('/:subJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inSubJob('body', 'employee')),
    subJob.getSubJob
)
router.put('/:subJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inSubJob('body', 'author')),
    subJob.updateSubJob
)
router.delete('/:subJobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inSubJob('body', 'author')),
    subJob.deleteSubJob
)

router.post('/:subJobId/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inSubJob('body', 'manager')),
    subJob.changeUserRole
)

router.post('/:subJobId/move-to-trash',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inSubJob('body', 'author'), ),
    subJob.setSubJobInTrash
)

router.post('/:subJobId/unmove-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inSubJob('self', 'author')),
    subJob.unsetSubJobInTrash
)

router.post('/:subJobId/hidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inSubJob('self', 'author')),
    subJob.hiddenSubJob
)

router.post('/:subJobId/unhidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inSubJob('self', 'author')),
    subJob.unHiddenSubJob
)

router.delete('/:subJobId/delete',
    authentication.required,
    checkPermit(inCompany('self', 'manager')),
    subJob.deleteSubJob
)

router.post('/:subJobId/add-members',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inSubJob("self", "employee")),
    subJob.addMembers
)

router.post('/:subJobId/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    subJob.removeMember
)

module.exports = router