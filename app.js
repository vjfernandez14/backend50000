
const app = require('./server')
const handlebars = require('express-handlebars')
const port = 8080;  
const {Server} = require('socket.io')

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
    console.log(socket.id)
        socket.on('message', data => {
        console.log(data)
    })

    socket.emit('messageServer', 'Hola desde el server')
}) 