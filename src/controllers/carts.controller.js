const express = require('express');
const router = express.Router();
const CartsManager = require('../../CartsManager');
const cartsModel = require('../models/carts.model')
const CartsManagerMongo = require('../dao/cartsManagerMongo')

const cartsManager = new CartsManager('carts.json');
const cartsManagerMongo = new CartsManagerMongo()

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManagerMongo.createCart();
        res.json(newCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

//router.post('/', async (req, res) => {
    //try {
        //const newCart = await cartsManager.createCart();
       // res.json(newCart);
    //} catch (error) {
       // console.error(error);
        //res.status(500).json({ error: 'Error al crear el carrito' });
    //}
//});

router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find();
        res.json(carts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

//router.get('/', async (req, res) => {
    //try {
        //const carts = await cartsManager.getCarts();
       // res.json(carts);
    //} catch (error) {
        //console.error(error);
        //res.status(500).json({ error: 'Error al obtener los carritos' });
    //}
//});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid).populate({
            path: 'products.productId',
            model: 'products',
            options: {
                strictPopulate: false
            }
        });  

        let total = 0;

        cart.products.forEach(product => {
            total += product.quantity * product.productId.price;
        });

        res.render('carts.handlebars', { cart, total });
        
    } catch (error) {   
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

//router.get('/:cid', async (req, res) => {
   // try {
       // const { cid } = req.params;
       // const cart = await cartsManager.getCartById(cid);
        //res.json(cart);
    //} catch (error) {
        //console.error(error);
        //res.status(500).json({ error: 'Error al obtener el carrito' });
    //}
//});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity} = req.body;
        const cart = await cartsManagerMongo.addProductToCart(cid, pid, quantity);
        const updatedCart = await cartsModel.findById(cid);

        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        await updatedCart.save()
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

router.put('/:cid/product/:pid', async (req,res) => {
    try {
        const {cid,pid} = req.params
        const {quantity} = req.body

        const updatedCart = await cartsManagerMongo.updateProductQuantity(cid,pid,quantity)

        if(updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        console.log(updatedCart)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al actualizar producto del carrito' });
    }
})

router.delete('/:cid/product/:pid', async (req,res) => {
    try{
        const { cid, pid } = req.params

        const updateCart = await cartsManagerMongo.removeProductCart(cid,pid)
        res.json(updateCart)

    }catch(error) {
        console.log(error)
        res.status(500).json({error:'Error al eliminar el producto del carrito'})
    }
})

router.delete('/:cid', async (req,res) => {
    try {
        const {cid} = req.params

        const result = await cartsManagerMongo.removeAllProductsFromCart(cid);

        if (result.success) {
            res.json({ status: 'success', message: 'Se eliminaron todos los productos del carrito' });
        } else {
            res.status(404).json({ status: 'error', message: 'No se encontró el carrito' });
        }

    } catch (error) {
        res.status(500).json({error:'Error al eliminar el producto del carrito'})
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { productId } = req.body;    

        
        const result = await cartsManagerMongo.updateCartWithProductId(cid, productId);

        if (result.success) {
            res.json({ status: 'success', message: 'Carrito actualizado con nuevos productos' });
        } else {
            res.status(404).json({ status: 'error', message: 'No se encontró el carrito' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;


