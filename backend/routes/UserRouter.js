const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.post('/signup', userController.createUser)
router.post('/signin', userController.loginUser)
router.get('/:id', userController.getDetailsUser)
router.put('/:id', userController.updateUser)

module.exports = router