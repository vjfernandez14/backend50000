const express = require('express')
const router = require('./src/router/index')


const app = express();

//console.log(process.cwd())

app.use(express.json())
app.use(express.static('public'))

router(app)

module.exports = app