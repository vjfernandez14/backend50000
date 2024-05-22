const express = require('express');
const router = express.Router();
const CartsManager = require('../../CartsManager');
const cartsModel = require('../models/carts.model')
const CartsManagerMongo = require('../dao/cartsManagerMongo');
const ProductMangerMongo = require('../dao/productsMangerMongo');
const transport = require('../utils/nodemailer');
const { email } = require('../configs/client');
const CustomError = require('../handlers/errors/custom-errors');
const dictonaryErrors = require('../handlers/errors/enum-errors');
const UsersDao = require('../dao/Users.dao');

const cartsManager = new CartsManager('carts.json');
const cartsManagerMongo = new CartsManagerMongo()
const Users = new UsersDao

router.get('/:cid/purchase',  (req,res) => {
    res.render('carts.handlebars')
})

router.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const myCart = await cartsManagerMongo.getCartById(cartId)
        if (!myCart) {
            throw CustomError.createError({ 
                name: 'Error', 
                message: 'Carrito no encontrado', 
                code: dictonaryErrors.NOT_FOUND 
            });
        }
        for (let i = 0; i < myCart.products.length; i++) {
            const product = myCart.products[i];
            const productManager = new ProductMangerMongo
            const newproduct = await productManager.updateProductStock(product.productId,product.stock,product.quantity)
            console.log('llega')    
            break; 
            }

            const user = await Users.find({ cartId: cartId });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            

        const purchaseResult = await cartsManagerMongo.purchaseCart(cartId,user)
        console.log(purchaseResult)
        await transport.sendMail({
            from: email.identifier,
            to: email.identifier,
            subject: 'Gracias por tu compra',
            html:`
            <h1>Compra realizada con exito</h1>
            <p>tu numero de comprobante es: ${purchaseResult.code}</p>
            <h2>TOTAL: ${purchaseResult.amount}</h2>
            `
        })
        console.log('envia el mail')
        await cartsManagerMongo.removeAllProductsFromCart(cartId)
        res.render('ticket.handlebars',{purchaseResult})
    } catch (error) {
        const statusCode = (typeof error.code === 'number' && error.code >= 400 && error.code < 600) ? error.code : 500;
        res.status(statusCode).json({ error: error.message });
    }
}) 

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManagerMongo.createCart();
        res.json(newCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});


 
router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find();
        res.json(carts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});



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



router.post('/:cid/product/:pid', async (req, res) => {
    try { 
        const { cid, pid } = req.params;
        const { quantity} = req.body;
        const {stock} = req.body
        console.log(stock)
        const cart = await cartsManagerMongo.addProductToCart(cid, pid, quantity, stock);
        const updatedCart = await cartsModel.findById(cid);
        
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        await updatedCart.save()
        res.redirect(`/api/carts/${cid}`);
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
        console.log(cid)
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


