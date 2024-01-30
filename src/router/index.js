const productsController = require('../controllers/products.controller.js')
const cartsController = require('../controllers/carts.controller.js')
const templatesController = require('../controllers/templatesController.js')
const filterController = require('../controllers/filter.controllers.js')
const usersController = require('../controllers/users.controller.js')
const loginController = require('../controllers/login.controller.js')

const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
    app.use('/api/chat',templatesController)
    app.use('api/category',filterController)
    app.use('/api/users', usersController)
    app.use('/api/users', usersController)
    app.use('/api/users/login', loginController)
}

module.exports = router