const express = require('express')
const ProductManager = require('./ProductManager.js');


const productManager = new ProductManager('./products.json');


const app = express();

const port = 3000;  

app.get('/products', async (req,res)=>{

    try {
        const { limit } = req.query;

        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit, 10));
            return res.json(limitedProducts);
        } 
            return res.json(products);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
})

app.get('/products/:pid', async (req,res)=>{

    try {
        const { pid } = req.params;

        const product = await productManager.getProductById(Number(pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
})

app.listen(port,()=>{
    console.log('running server...')
})