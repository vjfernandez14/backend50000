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

    async findAll() {
        return await Users.find()
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

    async deleteInactiveUsers(inactivityPeriodMinutes) {
        const inactivityPeriod = new Date(Date.now() - inactivityPeriodMinutes * 60 * 1000);
        try {
            console.log(inactivityPeriod)
            const inactiveUsers = await this.find({ last_connection: { $lt: inactivityPeriod } });
            console.log(inactiveUsers)
            const deletedUsers = await Promise.all(inactiveUsers.map(async (user) => {
                await this.delete(user._id);
                await transport.sendMail({
                    from: email.identifier,
                    to: user.email,
                    subject: 'Cuenta Eliminada por Inactividad',
                    html: `
                        <h1>Hola ${user.first_name},</h1>
                        <p>Tu cuenta ha sido eliminada debido a inactividad.</p>
                    `
                });
                return user;
            }));
            return deletedUsers;
        } catch (error) {
            throw new Error('Error al eliminar usuarios inactivos: ' + error.message);
        }
    }
    
}

module.exports = UsersDao