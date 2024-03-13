class UsersRepository {
    constructor(dao){
        this.dao = dao
    }

    async find(query){
        return await this.dao.find(query)
    }

    async create(newUserInfo){
        await this.dao.create(newUserInfo)
    }
}

module.exports = UsersRepository