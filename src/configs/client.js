require('dotenv').config()

module.exports = {
    ghClientId: process.env.GH_CLIENT_ID,
    ghClientSecret: process.env.GH_CLIENT_SECRET,
    DB_KEY: process.env.MONGOOSE_KEY,
    environment: process.env.ENVIRONMENT
}