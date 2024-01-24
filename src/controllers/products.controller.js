const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const mongoosePaginate = require('mongoose-paginate-v2')




const productsMangerMongo = require('../dao/productsMangerMongo')
const ProductManager = require('../../ProductManager');
const productsModel = require('../models/products.model');
const messagesModel = require('../models/messages.model');



const productManager = new ProductManager('products.json');
const productManagerMongo = new productsMangerMongo()

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Construir el objeto de opciones para la consulta paginada
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: parseInt(sort) ? { [sort]: 1 } : { [sort]: -1 } ,
            lean: true, 
        };
        console.log(options)

        // Construir el objeto de filtro para la consulta
        const filter = query ? { category: query } : {}; // Esto es un ejemplo, ajusta según tus necesidades

        // Realizar la consulta paginada
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productsModel.paginate(filter, options);
        telefonia = docs
        console.log(docs)
        res.render("telefonia.handlebars", {
            telefonia,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            query,
            limit,
        });
        
        const response = {
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `/telefonia?page=${prevPage}&limit=${limit}` : null,
            nextLink: hasNextPage ? `/telefonia?page=${nextPage}&limit=${limit}` : null,
        };

        console.log(response)
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//router.get('/', async (req, res) => {
    //try{
        //const products = await productManagerMongo.getProducts()
       // console.log(products)
   // }catch(error){
       // console.log(error)
    //}
//})



//router.get('/', async (req,res)=>{
//
    //try {
     // //  const { limit } = req.query;
//
       // const products = await productManager.getProducts();
//
       // if (limit) {
       //     const limitedProducts = products.slice(0, parseInt(limit, 10));
       //     return res.json(limitedProducts);
       // } 
       //     return res.json(products);
      //  
   // } catch (error) {
     //   console.error(error);
     //   res.status(500).json({ error: 'Error al obtener los productos' });
    //}
//})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productManagerMongo.getProductById(pid);

        if (product) {
            return res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

//router.get('/:pid', async (req,res)=>{  

    //try {
      //  const { pid } = req.params;
        
       
        //const product = await productManager.getProductById(Number(pid));
        //console.log(product)
        //if (product) {
           //return res.json(product);
        //} else {
            //res.status(404).json({ error: 'Producto no encontrado' });
        //}
    //} catch (error) {
       // console.error(error);
       // res.status(500).json({ error: 'Error al obtener el producto' });
    //}
//})

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, stock, code, status = true, category } = req.body;

        if (!title || !description || !price || !status || !stock || !code || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newProduct = await productManagerMongo.addProduct(title, description, price, stock, code, status, category, thumbnail);

        res.status(201).json({ message: 'Producto cargado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//router.post('/', async (req,res) =>{
    //try {
     // const {title,description, price, thumbnail, stock, code, status = true, category} = req.body
   //
      //const check = await productManager.addProduct(title,description,price,stock,code,status,category,thumbnail)
      //if(check){      
       // res.send('Producto cargado')
     // }
   // } catch(error) {    
     // res.status(500).json({error: error.message})
   // }
    
  //})

  router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, stock, code, status = true, category } = req.body;

    try {
        const productModi = await productManagerMongo.updateProduct(pid, title, description, price, stock, code, status, category, thumbnail);
        if (productModi) {
            res.json({ message: 'Producto actualizado', product: productModi });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error.message);
        if (error.message === 'No se encontró el producto') {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});

 // router.put('/:pid', async (req, res) => {
   // const { pid } = req.params;
    //const { title, description, price, thumbnail, stock, code, status = true, category } = req.body;

    //try {
        //const productModi = await productManager.updateProduct(Number(pid), title, description, price, stock, code, status, category, thumbnail);
        //if (productModi) {
          //  res.json({ message: 'Product updated', product: productModi });
       // } else {
        //    res.status(404).json({ message: 'Product not found' });
        //}
    //} catch (error) {
       // console.error(error.message);
       // if (error.message === 'No se encontró el producto') {
       //     res.status(404).json({ message: 'Product not found' });
        //} else {
       //     res.status(500).json({ message: 'Internal Server Error' });
       // }
    //}
//});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const productDelete = await productManagerMongo.deleteProduct(pid);
        if (productDelete) {
            res.json({ message: 'Producto eliminado', product: productDelete });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error.message);
        if (error.message === 'No se encontró el producto') {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});

//router.delete('/:pid', async (req, res) => {
    //const { pid } = req.params;

   // try {
       // const productDelete = await productManager.deleteProduct(Number(pid));
       // if (productDelete) {
          //  res.json({ message: 'Product deleted', product: productDelete });
        //} else {
           // res.status(404).json({ message: 'Product not found' });
        //}
    //} catch (error) {
       // console.error(error.message);
        //if (error.message === 'No se encontró el producto') {
           // res.status(404).json({ message: 'Product not found' });
        //} else {
          //  res.status(500).json({ message: 'Internal Server Error' });
        //}
    //}
//});



router.get('/home/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products)
        res.render('home.handlebars', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos para la vista home' });
    }
});

router.get('/home/realtimeproducts', async (req, res) => {
    try {
        const products = await productManagerMongo.getProducts();
        console.log(products)
        res.render('realTimeProducts.handlebars', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos para la vista home' });
    }
});

router.post('/home/realtimeproducts', async (req, res) => {
    try {
        const { title, description, price, stock, code, status = true, category, thumbnail } = req.body;

        
        const check = await productManagerMongo.addProduct(title, description, price, stock, code, status, category, thumbnail);
        if (check) {
            res.send('Producto cargado');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





module.exports = router;
