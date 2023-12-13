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

router.post('/',  async (req,res) =>{
    try {
        const {title,description, price, thumbnail, stock, code, status = true, category} = req.body

        const check = await productManager.addProduct(title,description,price,stock,code,status,category,thumbnail)

        if(check){
            return console.log("Producto cargado")
            console.log("Error al cargar producto")
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Error al agregar producto'})
    }
    
})

router.put('/:pid' , (req,res)=>{

        const {pid} = req.params
        const {title,description, price, thumbnail, stock, code, status = true, category} = req.body

        const productModi = productManager.updateProduct(pid,title,description, price, stock, code, status, category, thumbnail)
        
        
        res.json({message: 'Product update'})

    
    
})

router.delete('/:pid', (req,res)=>{
    const {pid} = req.params

    const productDelete = productManager.deleteProduct(pid)
    console.log(productDelete)
    if (!productDelete) {
        return res.json({ massage: 'Product Delete'})
    }
     res.status(404).json({massage:'Producto no encontrado'})
    

})

module.exports = router;
