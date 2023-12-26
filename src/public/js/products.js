const socket = io()


function createProduct() {
    const product = {
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: parseInt(document.getElementById('productPrice').value),
        status: document.getElementById('productStatus').checked,
        stock: parseInt(document.getElementById('productStock').value),
        code: parseInt(document.getElementById('productCode').value),
        category: document.getElementById('productCategory').value
    }
    socket.emit('createProduct', product)
}

socket.on('connect', () => {
    socket.emit('message', 'mensaje socket');

    socket.on('messageServer', data => {
        console.log(data)
    })
});




function deleteProduct() {
    const productIdToDelete = document.getElementById('productIdToDelete').value;
    socket.emit('deleteProduct', { id: productIdToDelete });
  }

  socket.on('updateProducts', updatedProducts => {
    
    console.log('Lista de productos actualizada:', updatedProducts);


});