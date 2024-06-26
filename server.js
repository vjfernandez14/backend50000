const express = require('express')
const router = require('./src/router/index');
const mongoConnect = require('./src/db');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const exphbs  = require('express-handlebars'); 
const path = require('path');


const app = express();

mongoConnect()

app.engine('handlebars', exphbs.engine({ 
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'src', 'views', 'partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    session({
        secret:'codeSecret',
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://ecommerce:Victor&297@cluster0.ryjggq1.mongodb.net/session?retryWrites=true&w=majority'
        }),
        resave: false,
        saveUninitialized: false,
    })
)

router(app)

module.exports = app 