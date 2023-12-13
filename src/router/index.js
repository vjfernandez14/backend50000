const productsController = require('../controllers/products.controller.js')
const cartsController = require('../controllers/carts.controller.js')


const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
}

module.exports = router