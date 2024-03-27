const winston = require('winston') 
const customWinstom = require('./custom.winstom')

const winstonLogger = winston.createLogger({
    levels: customWinstom.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customWinstom.colors}),
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error',
        }),
    ],
})

module.exports = winstonLogger