const mongoose = require('mongoose')

const cartsCollection = 'carts'

const cartsShema = new mongoose.Schema({
    cartId: {
        type: String,
        unique: true
    },
    products: [{ productId: String, quantity: Number }]
})  

const cartsModel = mongoose.model(cartsCollection, cartsShema)

module.exports = cartsModel