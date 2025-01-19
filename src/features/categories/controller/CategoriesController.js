const { isEmpty } = require("../../../utils/Helper")
const db = require('../../../database/db')
const { COLLECTIONS } = require("../../../utils/Constants")
const moment = require('moment')
const {v4} = require('uuid')

exports.addCategory = async (req, res) => {
    const { title, description } = req.body
    if (isEmpty(title)) {
        return res.status(400).json({
            message: "Please enter title!"
        })
    } else if (isEmpty(description)) {
        return res.status(400).json({
            message: "Please enter description!"
        })
    } else {
        const data = {
            id: v4(),
            title: title,
            description: description,
            createdAt: moment().valueOf()
        }
        try {
            await db.collection(COLLECTIONS.CATEGORIES).add(data).then(data => {
                return res.status(201).json({
                    message: "Category Added!"
                })
            }).catch(error => {
                return res.status(400).json({
                    message: error
                })
            })

        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }
    }
}

exports.getCategories = async (req, res) => {
    let categories = [];
    (await db.collection(COLLECTIONS.CATEGORIES).get()).docs.forEach(element => {
        categories.push(element.data())
    });
    return res.status(200).json({ data: categories })
}