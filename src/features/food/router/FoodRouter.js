const router = require('express').Router()
const controller = require('../controller/FoodController')
router.post('/food/add', controller.addFood)
router.get('/food/popular', controller.getPopularFood)
router.post('/food/add-image',controller.addFoodImage)
router.get('/food/sides',controller.getSides)
router.get('/food/all',controller.getAllFoodItems)
router.get('/food/combos',controller.getCombos)
module.exports = router