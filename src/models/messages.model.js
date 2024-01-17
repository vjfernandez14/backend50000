const mongoose = require('mongoose')

const messagesCollection = 'messages'

const messagesShema = new mongoose.Schema({
    User: String,
    Message: String
})  

const messagesModel = mongoose.model(messagesCollection, messagesShema)

module.exports = messagesModel