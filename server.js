const express = require('express')
const router = require('./src/router/index');
const mongoConnect = require('./src/db');


const app = express();

mongoConnect()

//console.log(process.cwd())

app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))

router(app)

module.exports = app 