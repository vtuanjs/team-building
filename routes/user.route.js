const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/register-user', async (req, res) => {
    let { name, email, password } = req.body
    try {
        await userController.create(name, email, password)
        res.json({
            result: 'ok',
            message: 'Register user successfully!',
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Register user failed. Error: ${error}`
        })
    }
})

router.post('/admin/block-by-ids', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { userIds } = req.body
    try {
        await userController.blockByIds(userIds, tokenKey)
        res.json({
            result: 'ok',
            message: 'Block user successfully!'
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Error block user: ${error}`
        })
    }
})

// router.delete('/admin/delete-by-ids', async (req, res) => {
//     let tokenKey = req.headers['x-access-token']
//     let { userIds } = req.body
//     try {
//         await userController.deleteByIds(userIds, tokenKey)
//         res.json({
//             result: 'ok',
//             message: 'Delete user successfully!'
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `Error delete user: ${error}`
//         })
//     }
// })

module.exports = router