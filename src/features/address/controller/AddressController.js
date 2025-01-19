const appHelper = require('../../../utils/Helper')
const authHelper = require('../../../utils/AuthHelper')
const db = require('../../../database/db')
const { v4 } = require('uuid')
const { COLLECTIONS } = require("../../../utils/Constants")

exports.addNewAddress = async (req, res) => {
    const { addressType, address } = req.body
    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    if (appHelper.isEmpty(addressType)) {
        return res.status(400).json({
            message: "Please provide address type!"
        })
    } else if (appHelper.isEmpty(address)) {
        return res.status(400).json({
            message: "Address can't be empty!"
        })
    } else {
        try {
            const data = {
                userId: userId,
                address: address,
                addressType: addressType,
                id: v4()
            }
            await db.collection(COLLECTIONS.ADDRESS).add(data)
            return res.status(201).json({
                message: "New Address Added!",
                data: data
            })
        } catch (error) {
            return res.status(400).json({
                message: error
            })
        }
    }
}

exports.getAllAddress = async (req, res) => {
    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const addresses = []

    try {
        (await db.collection(COLLECTIONS.ADDRESS).where("userId", "==", userId).get()).docs.forEach(query => {
            addresses.push({
                address:query.data().address,
                addressType: query.data().addressType,
                id: query.data().id
            })
        })
        return res.status(200).json({
            message: "Available Addresses!",
            data: addresses
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }

    await Address
        .find({ userId: userId })
        .then((addresses) => {
            return res.status(200).json({
                data: addresses
            })
        }).catch(error => {
            return res.status(400).json({
                message: error.message
            })
        })
}