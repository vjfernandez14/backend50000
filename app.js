
const app = require('./server')
const handlebars = require('express-handlebars')
const port = 8080;  
const {Server} = require('socket.io')
const router = require('./src/router/index')
const axios = require('axios');



app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')



app.get('/products', (req, res) => {
    res.render('home.handlebars')
})

const httpServer = app.listen(port,()=>{
    console.log('running server...')
})

const io = new Server(httpServer) 

io.on('connection',socket => {
    console.log("Nuevo usuario conectado")
    socket.on('message', data => {
        console.log(data)
    })
    socket.emit('messageServer', 'Hola desde el server')

    socket.on('createProduct', async data => {
        try {
            
            const { title, description, price, stock, code, status = true, category } = data;
            console.log(data)
            
            const response = await axios.post('http://localhost:8080/api/products/home/realtimeproducts', {
                title,
                description,
                price,
                status,
                stock,
                code,
                category
            });
            console.log(response.status)
            if (response.status === 200) {
                
                console.log(response.data);
                // Enviar la actualización de productos a todos los clientes
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
            } else {
               
                console.error('Error en la solicitud:', response.statusText);
            }
        } catch (error) {
            console.error('Errorss en la solicitud:', error.message);
        }
    });

    socket.on('deleteProduct', async data => {
        try {
            const productIdToDelete = parseInt(data.id);


            const response = await axios.delete(`http://localhost:8080/api/products/${productIdToDelete}`);
            
            if (response.status === 200) {
                
                console.log(response.data);
                // Enviar la actualización de productos a todos los clientes
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
            } else {
               
                console.error('Error en la solicitud:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
        }
    });
}) 