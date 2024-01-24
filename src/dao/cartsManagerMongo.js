const mongoose = require('mongoose');
const CartModel = require('../models/carts.model');
const cartsModel = require('../models/carts.model');
const productsModel = require('../models/products.model');


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
            
            
            const existingProductIndex = cart.products.findIndex(product => product.productId === productId);
            
            if (existingProductIndex !== -1) {
                
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                
                const productToAdd = { productId, quantity };
                
                 cart.products.push(productToAdd);
                 
            }

            await CartModel.findOneAndUpdate({ _id: cartId }, cart);

            
            return cart;
        } catch (error) {
            throw new Error('Error al guardar el carrito');
        }
    }

    async removeProductCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId)
            console.log(cart.products)
            cart.products = cart.products.filter(product => {
                console.log("product._id:", product.productId, "productId:", productId);
                return product.productId.toString() !== productId.toString();
            });
            
            const updateCart = await cart.save()
            console.log(updateCart)
            return updateCart

        } catch (error) {
            throw(error)
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId);
            console.log(!cart)
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const existingProduct = cart.products.find(product => product.productId === productId);
            console.log(existingProduct)
            if (existingProduct) {
                existingProduct.quantity = quantity;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            await cart.save();
    
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeAllProductsFromCart(cartId) {
        try {
            
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }

            
            cart.products = [];

            
            await cart.save();

            return { success: true };
        } catch (error) {
            console.error('Error al eliminar productos del carrito:', error);
            throw new Error('Error al eliminar productos del carrito');
        }
    }

    async updateCartWithProductId (cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId)
            
            const populatedCart = await CartModel.findById({productId}).populate('products.productId');
            console.log(populatedCart); 

            
            const productsToAdd = await productIds.map(productId => ({ productId, quantity: 1 }));

             
            cart.products = productsToAdd;
            console.log(cart.products)
            return { success: true };
        } catch (error) {
            throw new Error('Error al actualizar carrito');
        }
    }
}
    


module.exports = CartsManager;