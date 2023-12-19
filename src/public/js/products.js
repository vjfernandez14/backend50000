const socket = io()

socket.emit('message','mensaje socket')

socket.on('messageServer', data => {
    console.log(data)
})