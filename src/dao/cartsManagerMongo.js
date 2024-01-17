const mongoose = require('mongoose');
const CartModel = require('../models/carts.model')


class CartsManager {
    async createCart() {
        const cartId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newCart = { id: cartId, products: [] };

        try {
            const createdCart = await CartModel.create(newCart);
            return createdCart.toObject();
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async getCartById(cartId) {
        console.log(cartId)
        try {
            const cart = await CartModel.findOne({ _id: cartId });
            console.log(cart)
            return cart ? cart.toObject() : null;
        } catch (error) {
            throw new Error('Error al obtener el carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
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

            await CartModel.findOneAndUpdate({ id: cartId }, cart);
            return cart;
        } catch (error) {
            throw new Error('Error al guardar el carrito');
        }
    }
}

module.exports = CartsManager;