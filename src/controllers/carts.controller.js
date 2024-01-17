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
        const cart = await cartsManagerMongo.getCartById(cid);
        res.json(cart);
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
        const { quantity } = req.body;

        const cart = await cartsManager.addProductToCart(cid, Number(pid), quantity);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;
