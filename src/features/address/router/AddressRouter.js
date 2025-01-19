const router = require('express').Router()
const controller = require('../controller/AddressController')
const authenticator = require('../../../autheticator/Authenticator')

router.post('/add-address', authenticator, controller.addNewAddress)
router.get('/address', authenticator, controller.getAllAddress)

module.exports = router