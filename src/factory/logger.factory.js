const { enviromentLogger } = require("../configs/client");

switch (enviromentLogger) {
    case 'dev':
        module.exports = require('../utils/winston/devLogger')
        break;
    case 'prod':
        module.exports = require('../utils/winston/prodLogger')
        break;

    default:
        break;
} 