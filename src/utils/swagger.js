const swaggerJSDoc = require("swagger-jsdoc");
const {dirname} = require('path')

const dirnameSw =  dirname(dirname(__filename))

const swaggerOptions = {
    definition:{
        openapi: '3.1.0',
        info: {
            title: 'Documentacion E commerce',
            description: 'Informacion relacionada a la API Ecommerce'
        }
    },
    apis: [`${dirnameSw}/docs/**/*.yaml`] 
}

const specs = swaggerJSDoc(swaggerOptions)

module.exports = specs 