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
    thumbnail: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',           
        default: 'admin',
        validate: {
            validator: async function (value) {
                if (!value) return true; 
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'premium'; 
            },
            message: 'El propietario debe ser un usuario premium.'
        } 
    }

})  

productsShema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsShema)

module.exports = productsModel