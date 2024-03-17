const mongoose = require('mongoose')

const usersCollection = 'user'

const usersShema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    age: Number,
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user', 
    },
    cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
        },  
    githubId: Number,
    githubUsername: String,

})

const Users = mongoose.model(usersCollection, usersShema)

module.exports = Users