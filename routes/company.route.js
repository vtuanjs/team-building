const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    isAdmin, isCompanyMember, isCompanyManager, checkPermit
} = require('../middlewares/permistion.middleware')

// Header: x-access-token
// Body: name, address, emailDomain
router.post('/add',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        checkPermit(isAdmin(user))(next)
    },
    companyController.add
)

// Header: x-access-token
// Body: name, address, companyId
router.put('/update',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.body
        checkPermit(
            isAdmin(user),
            isCompanyManager(user, companyId)
        )(next)
    },
    companyController.update
)

// Header: x-access-token
// Params: companyId
router.post('/admin/block-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        checkPermit(isAdmin(user))(next)
    },
    companyController.blockCompanyById
)

// Header: x-access-token
// Params: companyId
router.post('/admin/unlock-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        checkPermit(
            isAdmin(user)
        )(next)
    },
    companyController.unlockCompanyById
)

// Params: companyId
router.get('/find-by-user-id/:userId',
    companyController.findByUserId
)

// Header: x-access-token
// Params: companyId
router.get('/get-detail-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.params
        checkPermit(
            isAdmin(user),
            isCompanyMember(user, companyId)
        )(next)
    },
    companyController.getDetailById
)

module.exports = router