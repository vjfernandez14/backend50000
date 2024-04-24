const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
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
        validate: {
            validator: async function(value) {
                if (!value) return true; // Permitir null o undefined
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'premium';
            },
            message: 'El propietario debe ser un usuario premium.'
        }
    }
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = productsModel;
