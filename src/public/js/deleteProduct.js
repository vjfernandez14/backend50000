
document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.closest('form').getAttribute('data-product-id');
            const response = await fetch(`/api/carts/{{cart._id}}/product/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Actualizar la interfaz de usuario si es necesario
            } else {
                console.error('Error al eliminar el producto del carrito');
            }
        });
    }); 
});