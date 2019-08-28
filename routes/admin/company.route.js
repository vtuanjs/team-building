const express = require('express')
const router = express.Router()
const companyController = require('../../controllers/company.controller')
const authentication = require('../../middlewares/auth.middleware')
const { checkPermit, inUser } = require('../../middlewares/permistion.middleware')

router.put('/update',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.update
)

// Header: x-access-token
// Params: companyId
router.delete('/delete-by-id/:companyId?',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.deleteById
)

// Header: x-access-token
// Params: companyId
router.post('/block-by-id/:companyId?',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.blockCompanyById
)

// Header: x-access-token
// Params: companyId
router.post('/unlock-by-id/:companyId?',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.unlockCompanyById
)

// Params: companyId
router.get('/show-list-company',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.showListCompany
)

router.post('/change-user-role',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.changeUserRole
)

router.post('/upgrade-vip',
    authentication.required,
    checkPermit(inUser("admin")),
    companyController.upgradeVip
)

module.exports = router