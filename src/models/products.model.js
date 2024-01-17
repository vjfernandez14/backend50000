const mongoose = require('mongoose')

const productsCollection = 'products'

const productsShema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    code: {
        type: Number,
        unique: true
    },
    status: Boolean,
    category: String,
    thumbnail: String

})  

const productsModel = mongoose.model(productsCollection, productsShema)

module.exports = productsModel