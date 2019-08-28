const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')
const authentication = require('../../middlewares/auth.middleware')
const { checkPermit, inUser } = require('../../middlewares/permistion.middleware')

// //Header: x-access-token
// //Body: userIds
router.post(
    '/admin/block-by-ids',
    authentication.required,
    checkPermit(inUser("admin")),
    userController.blockByIds
)

router.post(
    '/admin/unlock-by-ids',
    authentication.required,
    checkPermit(inUser("admin")),
    userController.unlockByIds
)

module.exports = router