class UsersMemoryDao {
    constructor() {
      this.users = []
    }
  
    find(id) {
      console.log(id)
      return this.users
    }   
  
    create(newUserInfo) {
      this.users.push(newUserInfo)
      return 'New User!!!'
    }
  }
  
  module.exports = UsersMemoryDao