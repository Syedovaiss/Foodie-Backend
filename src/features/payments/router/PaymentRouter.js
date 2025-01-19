const router = require('express').Router()
const controller = require('../controller/PaymentController')
const authenticator = require('../../../autheticator/Authenticator')

router.post('/add-payment-method',authenticator,controller.addPaymentMethod)
router.get('/payment-methods',authenticator,controller.getPaymentMethods)
module.exports = router