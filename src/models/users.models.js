const mongoose = require('mongoose')

const usersCollection = 'user'

const usersShema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user', 
    },

})

const Users = mongoose.model(usersCollection, usersShema)

module.exports = Users