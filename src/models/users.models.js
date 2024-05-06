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
        enum: ['user', 'admin','premium'],  
        default: 'user', 
    },
    cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
        },
    documents: [{
        name: String,
        reference: String,
    }],
    githubId: Number,
    githubUsername: String,
    last_connection: Date,

})

const Users = mongoose.model(usersCollection, usersShema)

module.exports = Users