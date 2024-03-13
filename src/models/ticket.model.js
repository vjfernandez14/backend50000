const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purcharse_datetime: {
        type: Date,
 
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        require: true,
    }
})

const Ticket = mongoose.model('Ticket',ticketSchema)

module.exports = Ticket