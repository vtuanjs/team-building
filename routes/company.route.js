const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    checkAdmin, checkCompanyMember, checkCompanyManager,
    checkProjectMember, checkProjectManager, checkPermit
} = require('../middlewares/permistion.middleware')

router.post('/add',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        checkPermit([checkAdmin(user)])(next)
    },
    companyController.add
)

router.get('/find-by-user-id/:userId',
    companyController.findByUserId
)

router.get('/show-members-by-id/:companyId',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.params
        checkPermit([checkAdmin(user), checkCompanyMember(user, companyId)])(next)
    },
    companyController.showMembersById
)

router.put('/update',
    authentication.required,
    (req, res, next) => {
        let user = res.locals.user
        let { companyId } = req.body
        checkPermit([checkAdmin(user), checkCompanyManager(user, companyId)])(next)
    },
    companyController.update
)

module.exports = router