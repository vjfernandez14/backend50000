function deleteProductBD(productId) {
    
    fetch(`/api//product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'  
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.reload(); // Recarga la página para reflejar los cambios en el carrito
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch(error => {
      console.error('Error de red:', error);
    });
  }
  