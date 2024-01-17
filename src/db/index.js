const mongoose = require('mongoose')

const mongoConnect =  async () => {
    try{
        await mongoose.connect('mongodb+srv://ecommerce:Victor&297@cluster0.ryjggq1.mongodb.net/ecommerce?retryWrites=true&w=majority')
        console.log('conexion mongo')
    } catch(error){
        console.log(error)
    }
   
}

module.exports = mongoConnect