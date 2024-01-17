const socket = io()


const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('massageLogs')

const getUsername = async () => {

    try {
        const username = await Swal.fire({
            title: "Bienvenido al chat",
            text: "Ingresa tu usuario",
            input: 'text',
            icon: "success"
          })

          socket.emit('newUser', {username: username.value})

          socket.on('userConected', user => {
            Swal.fire({
                text: `Se acaba de conectar ${user.username}`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success'
            })
          })

          chatBox.addEventListener('keyup', e =>{
            if(e.key === 'Enter') {
                const data = {
                    username: username.value,
                    message: chatBox.value
                } 
                chatBox.value = ''
                
                socket.emit('message', data)
            }
        })
          
    }catch (error) {
        console.log(error)
    }
   
}

getUsername()


socket.on('messageLogs', chats => {
    let messages = ''

    chats.forEach(chat => (messages += `${chat.username}  dice: ${chat.message} <hr>` ))

    messageLogs.innerHTML = messages
})