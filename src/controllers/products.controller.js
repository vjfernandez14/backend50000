const express = require('express')
const router = express.Router()
const handlebars = require('express-handlebars')
const mongoosePaginate = require('mongoose-paginate-v2')



const mongoose = require('mongoose')
const productsMangerMongo = require('../dao/productsMangerMongo')
const ProductManager = require('../../ProductManager');
const productsModel = require('../models/products.model');
const messagesModel = require('../models/messages.model');
const { isAdmin } = require('../middlewares/auth.middleware')
const { generateProducts } = require('../utils/product-mock.util')
const transport = require('../utils/nodemailer')
const UsersDao = require('../dao/Users.dao')
const { email } = require('../configs/client')
const userDao = new UsersDao


const productManager = new ProductManager('products.json');
const productManagerMongo = new productsMangerMongo()

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: parseInt(sort) ? { [sort]: 1 } : { [sort]: -1 } ,
            lean: true, 
        };
        console.log(options)

       
        const filter = query ? { category: query } : {}; // Esto es un ejemplo, ajusta según tus necesidades

       
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productsModel.paginate(filter, options);
        telefonia = docs
        console.log(docs)

        if (!req.session.user) {
            return res.redirect('/'); 
        }
        
    
    
        const userData = req.session.user;
    

        res.render("telefonia.handlebars", {
            telefonia,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            query,
            limit,
            user: userData,    
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

router.get('/mockingproducts', async (req,res) => {
    try {
        const products = generateProducts(100) 
        res.render('telefonia.handlebars',{telefonia:products})

    } catch (error) {
        console.log(error)
    }
})



router.get('/updateProducts', isAdmin, (req, res) => {
    res.render('admin.handlebars')    
})

router.post('/updateProducts',   async (req, res) => {
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

 


router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    
    try {
        const product = await productManagerMongo.getProductById(pid)
        console.log(product)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const ownerId = product.owner; 
        const owner = await userDao.find({ _id: ownerId });
        console.log(owner)
        if (!owner) {
            return res.status(404).json({ message: 'Propietario del producto no encontrado' });
        }

        const productDelete = await productManagerMongo.deleteProduct(pid)
        if (productDelete) {
            if (owner.role === 'premium') {
                try {
                    await transport.sendMail({
                        from: email.identifier,
                        to: owner.email,
                        subject: 'Producto Eliminado',
                        html: `<p>Hola ${owner.first_name},</p><p>Tu producto "${product.title}" ha sido eliminado del catálogo.</p>`
                    });
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error);
                }
            } }
        console.log(productDelete)
     } catch (error) {
        console.error(error.message);
        if (error.message === 'No se encontró el producto') {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});



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
        console.log(user)
        res.render('realTimeProducts.handlebars', { products },{user});
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
