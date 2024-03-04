const mongoose = require('mongoose')
const Users = require('../models/users.models')


class UsersDao {
    async createUser(newUserInfo) {
        return await Users.create(newUserInfo)
    }

    async find(query) {
       return await Users.findOne(query)
    }

    async delete(){
        return await Users.deleteOne({_id: userId})
    }
}

module.exports = UsersDao