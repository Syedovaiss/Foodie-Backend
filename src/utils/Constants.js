exports.COLLECTIONS = Object.freeze({
    USER: "user",
    CATEGORIES: "categories",
    FOOD: "food",
    TOPPINGS: "toppings",
    SIDES:"sidelines",
    PAYMENT:"payment-info",
    ADDRESS:"address-info",
    ORDERS:"orders"
})

exports.ORDER_STATUS = Object.freeze( {
    PENDING:"Pending",
    PREPARING:"Preparing",
    READY:"Ready",
    ASSIGNING_RIDER:"Assiging Rider",
    ASSIGNED_TO_RIDER:"Assigned to Rider",
    OUT_FOR_DELIVERY:"Out of Delivery",
    DELIVERED:"Delivered",
    CANCELLED:"Cancelled"
})