const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inUser } = require('../middlewares/permistion.middleware')

//Body: name, email, password
router.post('/register-user', userController.create)

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

router.get('/find-by-email/:email', userController.findByEmail)

module.exports = router