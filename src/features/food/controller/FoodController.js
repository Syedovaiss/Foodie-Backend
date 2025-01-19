const { isEmpty, isNull } = require("../../../utils/Helper")
const db = require('../../../database/db')
const { COLLECTIONS } = require("../../../utils/Constants")
const { v4 } = require("uuid")
const imageConfig = require('../../../utils/ImageConfig')
const path = require('path')
const fs = require('fs')

exports.addFood = async (req, res) => {
    const { categoryId, title, description, rating, prepTime, levelTitle, startLevel, endLevel, price, isPopular, canBecomeCombo } = req.body
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
    } else if (isNull(isPopular)) {
        return res.status(400).json({
            message: "Popular can't be empty!"
        })
    } else if (isNull(canBecomeCombo)) {
        return res.status(400).json({
            message: "Combo can't be empty!"
        })
    } else {
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
    const popularFood = [];
    try {
        (await db.collection(COLLECTIONS.FOOD).where("isPopular", "==", "true").get()).docs.forEach(query => {
            popularFood.push(query.data())
        })
        return res.status(200).json({
            message: "Popular Food!",
            data: popularFood
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.addFoodImage = async (req, res) => {
    const foodId = req.query.foodId
    if (isNull(foodId)) {
        return res.status(400).json({
            message: "Please provide food id"
        })
    } else {
        imageConfig.upload(req, res, async (error) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong while saving image."
                })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const filePath = path.join('uploads', req.file.filename);

            try {
                const foodSnapshot = (await db.collection(COLLECTIONS.FOOD).where("foodId", "==", foodId).get())
                const foodDoc = foodSnapshot.docs[0];
                const foodRef = foodDoc.ref;
                const imageInfo = {
                    image: filePath
                }
                foodRef.update(imageInfo)
                return res.status(201).json({
                    message: "Image added successfully!"
                })

            } catch (err) {
                res.status(500).json({ error: 'Failed to save image in database.', details: err });
            }
        })
    }
}

exports.getAllFoodItems = async (req, res) => {
    const allFood = [];
    try {
        (await db.collection(COLLECTIONS.FOOD).get()).docs.forEach(query => {
            allFood.push(query.data())
        })
        return res.status(200).json({
            message: "All Food!",
            data: allFood
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.getCombos = async (req, res) => {
    const combos = [];
    try {
        const comboQuery = await db.collection(COLLECTIONS.FOOD)
            .where("canBecomeCombo", "==", "true")
            .get();

        comboQuery.docs.forEach(query => {
            combos.push(query.data());
        });

        const categoryQuery = await db.collection(COLLECTIONS.FOOD)
            .where("categoryId", "==", "b59c42f0-5ec1-42e6-afaa-d42111acb7b3")
            .get();

        categoryQuery.docs.forEach(query => {
            const data = query.data();
            if (!combos.some(item => item.id === data.id)) {
                combos.push(data);
            }
        });

        return res.status(200).json({
            message: "Combo Food!",
            data: combos
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred"
        });
    }

}

exports.addToppings = async(req,res) => {
    const toppingTitle = req.query.toppingTitle
    const price = req.query.price
    if(isEmpty(toppingTitle)) {
        return res.status(400).json( {
            message: "Please provide title!"
        })
    } else if(isEmpty(price)) {
        return res.status(400).json( {
            message: "Please provide price!"
        })
    } else {
        imageConfig.upload(req, res, async (error) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong while saving image."
                })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const filePath = path.join('uploads', req.file.filename);

            try {
                const data = {
                    image: filePath,
                    title: toppingTitle,
                    id: v4()
                }
                await db.collection(COLLECTIONS.TOPPINGS).add(data)
                return res.status(201).json({
                    message: "Topping added successfully!"
                })

            } catch (err) {
                res.status(500).json({ error: 'Failed to save data in database.', details: err });
            }
        })
    }
}

exports.getToppings = async(req,res) => {
    const toppings = [];
    try {
        (await db.collection(COLLECTIONS.TOPPINGS).get()).docs.forEach(query => {
            toppings.push(query.data())
        })
        return res.status(200).json({
            message: "All Food Toppings!",
            data: toppings
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.addSides = async(req,res) => {
    const sides = req.query.sidesTitle
    const price = req.query.price
    if(isEmpty(sides)) {
        return res.status(400).json( {
            message: "Please provide title!"
        })
    } else if(isEmpty(price)) {
        return res.status(400).json( {
            message: "Please provide price!"
        })
    }else {
        imageConfig.upload(req, res, async (error) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong while saving image."
                })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const filePath = path.join('uploads', req.file.filename);

            try {
                const data = {
                    image: filePath,
                    title: sides,
                    price: price,
                    id: v4()
                }
                await db.collection(COLLECTIONS.SIDES).add(data)
                return res.status(201).json({
                    message: "Sideline added successfully!"
                })

            } catch (err) {
                res.status(500).json({ error: 'Failed to save data in database.', details: err });
            }
        })
    }
}

exports.getSides = async(req,res) => {
    const sides = [];
    try {
        (await db.collection(COLLECTIONS.SIDES).get()).docs.forEach(query => {
            sides.push(query.data())
        })
        return res.status(200).json({
            message: "All Food Sidelines!",
            data: sides
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}