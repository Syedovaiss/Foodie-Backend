const { isEmpty, isNull } = require("../../../utils/Helper")
const db = require('../../../database/db')
const { COLLECTIONS } = require("../../../utils/Constants")
const { v4 } = require("uuid")
exports.addFood = async (req, res) => {
    const { categoryId, title, description, rating, prepTime, levelTitle, startLevel, endLevel, price, isPopular,canBecomeCombo } = req.body
    if (isEmpty(categoryId)) {
        return res.status(400).json({
            message: "Category Id can't be empty!"
        })
    } else if (isEmpty(title)) {
        return res.status(400).json({
            message: "Title can't be empty!"
        })
    } else if (isEmpty(description)) {
        return res.status(400).json({
            message: "Description can't be empty!"
        })
    } else if (isEmpty(rating)) {
        return res.status(400).json({
            message: "Rating can't be empty!"
        })
    } else if (isEmpty(prepTime)) {
        return res.status(400).json({
            message: "Preparation Time can't be empty!"
        })
    } else if (isEmpty(levelTitle)) {
        return res.status(400).json({
            message: "Level can't be empty!"
        })
    } else if (isEmpty(startLevel)) {
        return res.status(400).json({
            message: "Start level can't be empty!"
        })
    } else if (isEmpty(endLevel)) {
        return res.status(400).json({
            message: "End level can't be empty!"
        })
    } else if (isEmpty(price)) {
        return res.status(400).json({
            message: "Price can't be empty!"
        })
    } else if(isNull(isPopular)) {
        return res.status(400).json({
            message: "Popular can't be empty!"
        })
    }  else if(isNull(canBecomeCombo)) {
        return res.status(400).json({
            message: "Combo can't be empty!"
        })
    }else {
        const food = {
            categoryId: categoryId,
            title: title,
            description: description,
            rating: rating,
            prepTime: prepTime,
            levelTitle: levelTitle,
            startLevel: startLevel,
            endLevel: endLevel,
            price: price,
            isPopular: isPopular,
            foodId: v4()
        }
        await db.collection(COLLECTIONS.FOOD).add(food)
        return res.status(201).json({
            message: "Food added!",
            data: food
        })
    }
}

exports.getPopularFood = async (req, res) => {

}

exports.addFoodImage = async (req, res) => {

}

exports.getSides = async (req, res) => {

}
exports.getAllFoodItems = async(req,res) => {

}

exports.getCombos = async(req,res) => {

}