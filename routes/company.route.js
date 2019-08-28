const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inCompany, inUser } = require('../middlewares/permistion.middleware')

// Header: x-access-token
// Body: name, address, emailDomain
router.post('/create',
    authentication.required,
    companyController.create
)

// Header: x-access-token
// Body: name, address, companyId
router.put('/update',
    authentication.required,
    checkPermit(inCompany("body", "manager")),
    companyController.update
)

// Params: companyId
router.get('/find-by-user-id/:userId?',
    authentication.required,
    companyController.findByUserId
)

// Header: x-access-token
// Params: companyId
router.get('/get-detail-by-id/:companyId?',
    authentication.required,
    companyController.getDetailById
)

router.post('/add-member',
    authentication.required,
    checkPermit(inUser("admin"), inCompany("self", "employee")),
    companyController.addMember
)

router.post('/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    companyController.removeMember
)

router.post('/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    companyController.changeUserRole
)

module.exports = router