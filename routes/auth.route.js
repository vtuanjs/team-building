const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/login', async (req, res) => {
	let { email, password } = req.body
	try {
		let foundUser = await authController.login(email, password)
		res.json({
			result: 'ok',
			message: 'Login user successfully!',
			data: foundUser
		})
	} catch (error) {
		res.json({
			result: 'failed',
			message: `Login user error : ${error}`
		})
	}
})

module.exports = router