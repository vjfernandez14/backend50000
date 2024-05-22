const ProductMangerMongo = require("../../dao/productsMangerMongo");
const Product = new ProductMangerMongo
const socket = io()


async function createProduct() {
    try {
            const product = {
                title: document.getElementById('productTitle').value,
                description: document.getElementById('productDescription').value,
                price: parseInt(document.getElementById('productPrice').value),
                status: document.getElementById('productStatus').checked,
                stock: parseInt(document.getElementById('productStock').value),
                code: parseInt(document.getElementById('productCode').value),
                category: document.getElementById('productCategory').value
            }
        
                const newProduct = await Product.addProduct(
                    product.title,
                    product.description, 
                    product.price,
                    product.status,
                    product.stock,
                    product.code,
                    product.category
                )

    } catch(error) {
        console.log(error)
    }
}





async function deleteProduct() {
    const productId = document.getElementById('productIdToDelete').value;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert('Producto eliminado correctamente');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto');
    }
}


  socket.on('updateProducts', updatedProducts => {
    
    console.log('Lista de productos actualizada:', updatedProducts);


});