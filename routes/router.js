const express = require('express')
const userController = require('../controllers/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const router = new express.Router()

// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// all-users
router.get('/all-users',jwtMiddleware,userController.allUserController) 

// view-user
router.get('/view-user',jwtMiddleware,userController.viewUserController)

module.exports = router