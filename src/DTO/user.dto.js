const { createHash } = require('../utils/crypt-password.util');

class UserDto {
    constructor(newUserInfo) {
      this.first_name = newUserInfo.first_name
      this.last_name = newUserInfo.last_name
      this.password = createHash(newUserInfo.password)
      this.email = newUserInfo.email
    }
  }
  
  module.exports = UserDto