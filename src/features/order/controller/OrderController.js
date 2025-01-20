const { isEmpty, isNull } = require("../../../utils/Helper")
const db = require('../../../database/db')
const authHelper = require('../../../utils/AuthHelper')
const { COLLECTIONS, ORDER_STATUS } = require("../../../utils/Constants")

exports.placeOrder = async (req, res) => {

    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const { addressId, paymentId, items, totalAmount } = req.body

    if (isEmpty(addressId)) {
        return res.status(400).json({
            message: "Please provide delivery address"
        })
    } else if (isEmpty(paymentId)) {
        return res.status(400).json({
            message: "Please provide payment details"
        })
    } else if (items.length === 0) {
        return res.status(400).json({
            message: "Please add items for order"
        })
    } else if (isEmpty(totalAmount)) {
        return res.status(400).json({
            message: "Please provide total amount!"
        })
    } else {
        const orderItems = []
        const address = (await db.collection(COLLECTIONS.ADDRESS).where("id", "==", addressId).get()).docs[0].data()
        const payment = (await db.collection(COLLECTIONS.PAYMENT).where("id", "==", paymentId).get()).docs[0].data()
        let areToppingsEmpty = false;
        items.forEach(item => {
            if (item.isCustomized) {
                if (isNull(item.toppings) || item.toppings.length === 0) {
                    areToppingsEmpty = true;
                } else {
                    orderItems.push({
                        productId: item.productId,
                        productTitle: item.productTitle,
                        productDescription: item.productDescription,
                        productImage: item.productImage,
                        level: item.level,
                        quantity: item.quantity,
                        toppings: item.toppings,
                        sides: item.sides
                    })
                }
            } else {
                orderItems.push({
                    productId: item.productId,
                    productTitle: item.productTitle,
                    productDescription: item.productDescription,
                    productImage: item.productImage,
                    level: item.level,
                    quantity: item.quantity
                })
            }

        });
        if (areToppingsEmpty) {
            return res.status(400).json({
                message: "Please provide toppings for your customize food!"
            })
        }
        const orderData = {
            userId: userId,
            address: address,
            payment: payment,
            orderItems: orderItems,
            totalAmount: totalAmount,
            shippingFee: 250,
            taxes: 500,
            ETA: 0,
            status: ORDER_STATUS.PENDING
        }
        await db.collection(COLLECTIONS.ORDERS).add(orderData)
        return res.status(201).json({
            message: "Order Placed Successfully!"
        })
    }
}

exports.fetchOrders = async (req, res) => {

    const token = req.header('Authorization')
    const userId = authHelper.getUserId(token)
    const orders = [];
    (await db.collection(COLLECTIONS.ORDERS).where("userId", "==", userId).get()).docs.forEach(order => {
        orders.push({
            id: order.id,
            order: order.data()
        })
    })
    return res.status(200).json({
        data: orders
    })
}