const mongoose = require('mongoose');
const CartModel = require('../models/carts.model');
const cartsModel = require('../models/carts.model');
const productsModel = require('../models/products.model');
const Ticket = require('../models/ticket.model');
const generateTicket = require('../services/ticket.service');


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

    async addProductToCart(cartId, productId, quantity,stock) {
        try { 
            let cart = await this.getCartById(cartId);
            
            if (!cart) {
                cart = await this.createCart();
            }
            
            let productFound = false;

    
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];
            
            if (product.productId.toString() === productId) {
                product.quantity = parseInt(product.quantity) + parseInt(quantity)
                productFound = true;
                break; 
            }
        }

        
        if (!productFound) {
            cart.products.push({ productId, quantity, stock });
        }

          
            await CartModel.findOneAndUpdate({ _id: cartId }, cart);

            
            return cart;
        } catch (error) {
            throw new Error('Error al guardar el carrito');
        }
    }

    async removeProductCart(cartId, productId) {
        try {
            
            console.log('remove')
            console.log(productId)
            const cart = await cartsModel.findById(cartId);
            console.log(cart.products[0].productId.toString)

            const updatedProducts = []

            for (let i = 0; i < cart.products.length; i++) {
               
                const product = cart.products[i].productId;
    
                
                if (product.toString() !== productId) {
                    
                    updatedProducts.push(product);
                    console.log(updatedProducts)
                }
            }
            
            cart.products = cart.products.filter(product => product.productId.toString() !== productId.toString());

            
            
            const updateCart = await cart.save();   
    
           
            return updateCart;
        } catch (error) {
            throw(error);
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
            console.log('llego')
            
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
 
    async purchaseCart (cartId,user) {
        try {
        
            const cart = await CartModel.findById(cartId).populate('products.productId')
            console.log(cart.products)
            if(!cart){
                throw new Error('Carrito no encontrado')
            }
 
            const productsNotPurchase = []

            cart.products.forEach( (item) =>{
                //console.log(item)
                const product = item.productId
                //console.log(product)
                const quantityInCart = item.quantity
                const stock = product.stock
                console.log(quantityInCart)
                
                if(stock < quantityInCart){
                    productsNotPurchase.push(product._id.toString())
                }
            }) 

            
            await Promise.all(cart.products.map(async (item) => {
                const product = item.productId
                const quantityInCart = item.quantity
                const stock = product.stock
                console.log(product._id.toString())
                console.log(productsNotPurchase)
                if(!productsNotPurchase.includes(product._id.toString())){
                    console.log(stock)
                    const newStock = stock - quantityInCart
                    console.log(product)
                    console.log(newStock)
                    await product.save()
                    
                }
            })) 
            
            console.log('ooo')
            const tick = await generateTicket(cart,user)
            console.log(tick)
            cart.purchased = true
            
            await cart.save()

            return  tick


        } catch (error) {
            throw new Error('Error en compra')
        }
    }
}
    


module.exports = CartsManager;