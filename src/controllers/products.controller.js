const express = require('express')
const router = express.Router()


const ProductManager = require('../../ProductManager');

const productManager = new ProductManager('products.json');


router.get('/', async (req,res)=>{

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

router.get('/:pid', async (req,res)=>{  

    try {
        const { pid } = req.params;
        
       
        const product = await productManager.getProductById(Number(pid));
        console.log(product)
        if (product) {
           return res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
})

router.post('/', async (req,res) =>{
    try {
      const {title,description, price, thumbnail, stock, code, status = true, category} = req.body
   
      const check = await productManager.addProduct(title,description,price,stock,code,status,category,thumbnail)
      if(check){      
        res.send('Producto cargado')
      }
    } catch(error) {    
      res.status(500).json({error: error.message})
    }
    
  })

  router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, stock, code, status = true, category } = req.body;

    try {
        const productModi = await productManager.updateProduct(Number(pid), title, description, price, stock, code, status, category, thumbnail);
        if (productModi) {
            res.json({ message: 'Product updated', product: productModi });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error.message);
        if (error.message === 'No se encontró el producto') {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const productDelete = await productManager.deleteProduct(Number(pid));
        if (productDelete) {
            res.json({ message: 'Product deleted', product: productDelete });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error.message);
        if (error.message === 'No se encontró el producto') {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});


module.exports = router;
