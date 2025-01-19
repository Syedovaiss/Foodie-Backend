const appHelper = require('../../../utils/Helper')
const authHelper = require('../../../utils/AuthHelper')
const db = require('../../../database/db')
const { v4 } = require('uuid')
const { COLLECTIONS } = require("../../../utils/Constants")

exports.addPaymentMethod = async (req, res) => {
    const { cardHolderName, cardNumber, expiry, cvv } = req.body
    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    if (appHelper.isEmpty(cardHolderName)) {
        return res.status(400).json({
            messaging: "Card holder name can't be empty!"
        })
    } else if (appHelper.isEmpty(cardNumber)) {
        return res.status(400).json({
            messaging: "Card number can't be empty!"
        })
    } else if (appHelper.isEmpty(expiry)) {
        return res.status(400).json({
            messaging: "Card expiry can't be empty!"
        })
    } else if (appHelper.isEmpty(cvv) || cvv.length > 3) {
        return res.status(400).json({
            messaging: "Please enter a valid cvv"
        })
    } else {
        try {
            const cardType = appHelper.getCardType(cardNumber)
            const data = {
                userId: userId,
                cardNumber: cardNumber,
                expiry: expiry,
                cardHolderName: cardHolderName,
                cardType: cardType,
                cvv: cvv,
                id: v4()
            }
            await db.collection(COLLECTIONS.PAYMENT).add(data)
            return res.status(201).json({
                message: `Card added for ${cardHolderName}`
            })
        } catch (error) {
            return res.status(400).json({
                message: error
            })
        }
    }
}


exports.getPaymentMethods = async (req, res) => {
    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const paymentMethods = [];
    try {
        (await db.collection(COLLECTIONS.PAYMENT).where("userId", "==", userId).get()).docs.forEach(query => {
            paymentMethods.push({
                cardHoldrerName:query.data().cardHolderName,
                cardNumber: appHelper.maskCardNumber(query.data().cardNumber),
                expiry: query.data().expiry,
                cardType:query.data().cardType,
                id: query.data().id
            })
        })
        return res.status(200).json({
            message: "Available Payment Methods!",
            data: paymentMethods
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}