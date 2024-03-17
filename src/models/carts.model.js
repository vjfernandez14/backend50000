const mongoose = require('mongoose')

const cartsCollection = 'carts'

const cartsShema = new mongoose.Schema({
    cartId: {
        type: String,
        unique: true
    },
         products: [{ 
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' // Referencia al modelo de productos
                },   
                    quantity: Number, 
                    stock: Number,                 
                }],
                users: [{   
                    email: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'user' // Referencia al modelo de productos
                    },               
                    }]
     })      

const cartsModel = mongoose.model(cartsCollection, cartsShema)

module.exports = cartsModel