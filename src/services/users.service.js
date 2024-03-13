const UserDto = require("../DTO/user.dto");
const UsersDao = require("../dao/Users.dao");
const UsersFactory = require("../factory/users.factory");
const Users = require("../models/users.models");

UsersDaoo = UsersFactory.createUserDao();

const getUsers = async (pk) => {
    return UsersDaoo.find(pk)
}

const createUser = async newUser => {
    const newUserInfo = new UserDto(newUser)
    console.log(newUserInfo)
    return await UsersDaoo.create(newUserInfo)
}

module.exports = {
    getUsers,
    createUser,
}