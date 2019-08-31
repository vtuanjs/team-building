const express = require('express')
const router = express.Router()
const company = require('../controllers/company.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inCompany, inUser } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    company.postCompany
)

router.get('/',
    company.getCompanies
)

router.put('/:companyId',
    authentication.required,
    checkPermit(inCompany("body", "manager"), inUser("admin")),
    company.updateCompany
)

router.get('/:companyId',
    authentication.required,
    company.getCompany
)

router.delete('/:companyId',
    authentication.required,
    checkPermit(inUser("admin")),
    company.deleteCompany
)

router.post('/:companyId/block',
    authentication.required,
    checkPermit(inUser("admin")),
    company.blockCompany
)

router.post('/:companyId/unlock',
    authentication.required,
    checkPermit(inUser("admin")),
    company.unlockCompany
)

router.post('/:companyId/add-member',
    authentication.required,
    checkPermit(inUser("admin"), inCompany("self", "employee")),
    company.addMember
)

router.post('/:companyId/remove-member',
    authentication.required,
    checkPermit(inUser("admin"), inCompany("self", "manager")),
    company.removeMember
)

router.post('/:companyId/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inUser("admin")),
    company.changeUserRole
)

router.post('/:companyId/upgrade-vip',
    authentication.required,
    checkPermit(inUser("admin")),
    company.upgradeVip
)

module.exports = router