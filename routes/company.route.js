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

router.get('/get-by-email-domain/:emailDomain',
    company.getCompanyByEmailDomain
)

router.get('/:companyId',
    company.getCompany
)

router.get('/:companyId/get-users',
    company.getUsersInCompany
)

router.put('/:companyId',
    authentication.required,
    checkPermit(inCompany("body", "manager"), inUser("admin")),
    company.updateCompany
)

router.delete('/:companyId',
    authentication.required,
    checkPermit(inUser("admin")),
    company.deleteCompany
)

router.post('/:companyId/add-members',
    authentication.required,
    checkPermit(inUser("admin"), inCompany("self", "employee")),
    company.addMembers
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