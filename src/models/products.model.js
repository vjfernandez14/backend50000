const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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

productsShema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsShema)

module.exports = productsModel