require('dotenv').config()

module.exports = {
    ghClientId: process.env.GH_CLIENT_ID,
    ghClientSecret: process.env.GH_CLIENT_SECRET,
    DB_KEY: process.env.MONGOOSE_KEY,
    environment: process.env.ENVIRONMENT,
    email: {
        identifier: process.env.EMAIL_IDENTIFIER,
        password: process.env.EMAIL_PASSWORD,
      },
}