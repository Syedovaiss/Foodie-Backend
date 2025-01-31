const authRouter = require('express').Router()
const authController = require('../controller/UserController')
const authenticator = require('../../../autheticator/Authenticator')
authRouter.post('/sign-up',authController.registerUser)
authRouter.post('/sign-in',authController.signIn)
authRouter.post('/add-bio',authenticator,authController.addUserInfo)
authRouter.post('/add-profile-picture',authenticator,authController.updateProfilePhoto)
authRouter.get('/profile',authenticator,authController.getUserProfile)
module.exports = authRouter