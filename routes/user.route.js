const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inUser, isUserSelf } = require('../middlewares/permistion.middleware')

//Body: name, email, password
router.post('/', user.postUser)

router.post('/admin/', user.postAdmin)

router.post(
    '/admin/:userIds/block',
    authentication.required,
    checkPermit(inUser("admin")),
    user.blockUsers
)

router.post(
    '/admin/:userIds/unlock',
    authentication.required,
    checkPermit(inUser("admin")),
    user.unlockUsers
)

router.get('/', user.getUsers)

router.get('/:userId', user.getUser)

router.get('/find-by-email/:email', user.findByEmail)

router.put('/:userId',
    authentication.required,
    checkPermit(isUserSelf(), inUser("admin")),
    user.updateUser
)

router.delete('/admin/:userId',
    authentication.required,
    checkPermit(inUser("admin")),
    user.deleteUser
)

module.exports = router