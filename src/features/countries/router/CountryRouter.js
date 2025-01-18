const countryRouter = require('express').Router()
const countryController = require('../controller/CountryController')
countryRouter.get('/countries',countryController.getCountries)
module.exports = countryRouter