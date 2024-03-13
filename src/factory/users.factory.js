const mongoConnect = require('../db/index')
const {environment} = require('../configs/client');
const UsersDao = require('../dao/Users.dao');
const UsersMemoryDao = require('../dao/Users-memory.dao');

class UsersFactory {
    static createUserDao() {
            switch (environment) {

            case 'MONGO':
                mongoConnect()
                return new UsersDao
                break;  
        
            case 'MEMORY':
                return new UsersMemoryDao
                break;  
                
        
            default:
                break;
        }
    }

}

module.exports = UsersFactory