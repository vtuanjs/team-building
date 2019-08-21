const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit } = require('../middlewares/permistion.middleware')

//Body: name, email, password
router.post('/register-user', userController.create)

// //Header: x-access-token
// //Body: userIds
router.post(
    '/admin/block-by-ids',
    authentication.required,
    checkPermit("admin"),
    userController.blockByIds
)

router.post(
    '/admin/unlock-by-ids',
    authentication.required,
    checkPermit("admin"),
    userController.unlockByIds
)

router.put('/update',
    authentication.required,
    userController.update
)

router.get(
    '/get-detail/:userId',
    authentication.required,
    userController.getDetailById
)

router.get(
    '/get-all-user',
    authentication.required,
    userController.getAllUser
)

module.exports = router