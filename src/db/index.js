const { DB_KEY} = require('../configs/client')

const mongoose = require('mongoose')


const mongoConnect =  async () => {
    try{
        await mongoose.connect(DB_KEY)
        console.log('conexion mongo')
    } catch(error){
        console.log(error)
    }
   
}

module.exports = mongoConnect