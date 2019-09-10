const express = require('express')
const router = express.Router()
const job = require('../controllers/job.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inPlant, inJob, inUser, inCompany } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'employee')),
    job.postJob
)

router.get('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('query', 'employee')),
    job.getJobs
)

router.get('/:jobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'employee')),
    job.getJob
)
router.put('/:jobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'author')),
    job.updateJob
)
router.delete('/:jobId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'author')),
    job.deleteJob
)

router.post('/:jobId/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'manager')),
    job.changeUserRole
)

router.post('/:jobId/move-to-trash',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inJob('body', 'author'), ),
    job.setJobInTrash
)

router.post('/:jobId/unmove-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inJob('self', 'author')),
    job.unsetJobInTrash
)

router.post('/:jobId/hidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inJob('self', 'author')),
    job.hiddenJob
)

router.post('/:jobId/unhidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inJob('self', 'author')),
    job.unHiddenJob
)

router.delete('/:jobId/delete',
    authentication.required,
    checkPermit(inCompany('self', 'manager')),
    job.deleteJob
)

router.post('/:jobId/add-members',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inJob("self", "employee")),
    job.addMembers
)

router.post('/:jobId/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    job.removeMember
)

module.exports = router