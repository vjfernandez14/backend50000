const productsController = require('../controllers/products.controller.js')
const cartsController = require('../controllers/carts.controller.js')
const templatesController = require('../controllers/templatesController.js')

const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
    app.use('/api/chat',templatesController)
}

module.exports = router