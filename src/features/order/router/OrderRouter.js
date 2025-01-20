const router = require('express').Router()
const controller = require('../controller/OrderController')
const authenticator = require('../../../autheticator/Authenticator')

router.post('/place-order',authenticator,controller.placeOrder)
router.get('/orders',authenticator,controller.fetchOrders)

module.exports = router