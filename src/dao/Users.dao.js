const mongoose = require('mongoose')
const Users = require('../models/users.models')
const CartsManager = require('./cartsManagerMongo')


class UsersDao {
    async create(newUserInfo) {
        console.log(newUserInfo)
        const cartManager = new CartsManager
        const newCart = await cartManager.createCart()
        console.log(newCart)
        newUserInfo.cartId = newCart._id
        console.log(newUserInfo)
        return await Users.create(newUserInfo)
    }

    async find(query) {
       return await Users.findOne(query)
    }

    async delete(userId){
        return await Users.deleteOne({_id: userId})
    }

    async update(userId, updatedFields) {
        try {
            
            const user = await Users.findById(userId);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            Object.assign(user, updatedFields);
 
            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDao