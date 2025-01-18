const router = require('express').Router()
const controller = require('../controller/CategoriesController')
router.post('/add-category', controller.addCategory)
router.get('/categories', controller.getCategories)
module.exports = router