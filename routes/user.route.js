const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authentication = require('../middlewares/auth.middleware')
const {
    isAdmin, isCompanyMember, isCompanyManager,
    isProjectMember, isProjectManager, checkPermit
} = require('../middlewares/permistion.middleware')

//Body: name, email, password
router.post('/register-user', userController.create)

// //Header: x-access-token
// //Body: userIds
router.post('/admin/block-by-ids',
    authentication.required,
    (req, res, next) => {
        const { user } = res.locals
        const companyId = user.company.id
        //Fake company id
        checkPermit(
            isAdmin(user),
            isCompanyManager(user, companyId)
        )(next)
    },
    userController.blockByIds
)

router.put('/update',
    authentication.required,
    userController.update
)

module.exports = router