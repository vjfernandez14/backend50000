const fs = require('fs').promises;

class CartsManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
        const cartId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newCart = { id: cartId, products: [] };

        try {
            const cartsData = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(cartsData);

            carts.push(newCart);

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async getCartById(cartId) {
        try {
            const cartsData = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(cartsData);

            const cart = carts.find(c => c.id === cartId);
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        let cart = await this.getCartById(cartId);
    
        if (!cart) {
            cart = await this.createCart();
        }
    
        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(product => product.productId === productId);
    
        if (existingProductIndex !== -1) {
            // Si el producto ya existe, aumenta la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agrégalo al carrito
            const productToAdd = { productId, quantity };
            cart.products.push(productToAdd);
        }
    
        try {
            const cartsData = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(cartsData);
    
            const index = carts.findIndex(c => c.id === cart.id);
            carts[index] = cart;
    
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error al guardar el carrito');
        }
    }
    
    
}

module.exports = CartsManager;


const cartCreate = new CartsManager('./carts.json')
//cartCreate.addProductToCart('gf3sbh9c8fsrizvws111s',1,6);

