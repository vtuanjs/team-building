const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit } = require('../middlewares/permistion.middleware')

// Header: x-access-token
// Body: name, address, emailDomain
router.post('/add',
    authentication.required,
    checkPermit("admin"),
    companyController.add
)

// Header: x-access-token
// Body: name, address, companyId
router.put('/update',
    authentication.required,
    checkPermit("admin", "manager"),
    companyController.update
)

// Header: x-access-token
// Params: companyId
router.delete('/delete-by-id/:companyId?',
    authentication.required,
    checkPermit("admin"),
    companyController.deleteById
)

// Header: x-access-token
// Params: companyId
router.post('/admin/block-by-id/:companyId?',
    authentication.required,
    checkPermit("admin"),
    companyController.blockCompanyById
)

// Header: x-access-token
// Params: companyId
router.post('/admin/unlock-by-id/:companyId?',
    authentication.required,
    checkPermit("admin"),
    companyController.unlockCompanyById
)

// Params: companyId
router.get('/find-by-user-id/:userId?',
    authentication.required,
    companyController.findByUserId
)

// Params: companyId
router.get('/show-list-company',
    authentication.required,
    checkPermit("admin"),
    companyController.showListCompany
)

// Header: x-access-token
// Params: companyId
router.get('/get-detail-by-id/:companyId?',
    authentication.required,
    companyController.getDetailById
)

router.post('/add-member',
    authentication.required,
    companyController.addMember
)

router.post('/remove-member',
    authentication.required,
    checkPermit("manager"),
    companyController.removeMember
)

router.post('/change-user-role',
    authentication.required,
    checkPermit("admin", "manager"),
    companyController.changeUserRole
)

router.post('/upgrade-vip',
    authentication.required,
    checkPermit("admin"),
    companyController.upgradeVip
)

module.exports = router