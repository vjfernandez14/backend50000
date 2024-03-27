const winston = require('winston') 
const customWinstom = require('./custom.winstom')

const winstonLogger = winston.createLogger({
    levels: customWinstom.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customWinstom.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
        })
    ]
})

module.exports = winstonLogger