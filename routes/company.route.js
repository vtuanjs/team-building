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
        const user = req.user
        const permit = checkPermit(
            isAdmin(user)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.add
)

// Header: x-access-token
// Body: name, address, companyId
router.put('/update',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.body
        const permit = checkPermit(
            isAdmin(user),
            isCompanyManager(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.update
)

// Header: x-access-token
// Params: companyId
router.delete('/delete-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const permit = checkPermit(
            isAdmin(user),
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.deleteById
)

// Header: x-access-token
// Params: companyId
router.post('/admin/block-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const permit = checkPermit(isAdmin(user))
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.blockCompanyById
)

// Header: x-access-token
// Params: companyId
router.post('/admin/unlock-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const permit = checkPermit(
            isAdmin(user)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.unlockCompanyById
)

// Params: companyId
router.get('/find-by-user-id/:userId',
    companyController.findByUserId
)

// Params: companyId
router.get('/show-company',
    companyController.showCompany
)

// Header: x-access-token
// Params: companyId
router.get('/get-detail-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.params
        const permit = checkPermit(
            isAdmin(user),
            isCompanyMember(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.getDetailById
)

router.post('/add-member',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.body
        const permit = checkPermit(
            isAdmin(user),
            isCompanyMember(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.addMember
)

router.post('/make-member-become-manager',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.body
        const permit = checkPermit(
            isAdmin(user),
            isCompanyMember(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.makeMemberBecomeManager
)

router.post('/make-manager-become-member',
    authentication.required,
    (req, res, next) => {
        const user = req.user
        const { companyId } = req.body
        const permit = checkPermit(
            isAdmin(user),
            isCompanyMember(user, companyId)
        )
        if (permit) return next()
        else return next("You don't have authorization to do this action!")
    },
    companyController.makeManagerBecomeMember
)

module.exports = router