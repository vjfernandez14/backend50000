const mongoose = require('mongoose');
const productsModel = require('../models/products.model')


class ProductMangerMongo {

    async addProduct(title, description, price, stock, code, status, category, thumbnail) {
        try {
            if (!title || !description || !price || !status || !stock || !code || !category) {
                throw new Error('Todos los campos son obligatorios');
            }

            
            const existingProduct = await productsModel.findOne({ code: code });
            if (existingProduct) {
                throw new Error('Ya existe un producto con el mismo código');
            }

           
            const newProduct = new productsModel({
                title,
                description,
                price,
                stock,
                code,
                status,
                category,
                thumbnail
            });

            
            await newProduct.save();

            return newProduct.toObject(); 
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async getProducts() {
        try {
            
            const products = await productsModel.find();
            return products.map(product => product.toObject()); 
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            
            const product = await productsModel.findById(id);
            
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product.toObject(); 
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }

    async updateProduct(id, title, description, price, code, stock, status, category, thumbnail) {
        try {
            
            const product = await productsModel.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.code = code || product.code;
            product.stock = stock || product.stock;
            product.status = status || product.status;
            product.category = category || product.category;
            product.thumbnail = thumbnail || product.thumbnail;

            // Guardar el producto actualizado en la base de datos
            await product.save();

            return product.toObject(); // Devolver el objeto del producto actualizado
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async updateProductStock(productId, stock, quantity) {
        try {
            
            const result = await productsModel.updateOne(
                { _id: productId }, 
                { $set: { stock: stock - quantity } } 
            );
    
            
            if (result.modifiedCount === 0) {
                throw new Error(`No se pudo actualizar el stock del producto con ID ${productId}`);
            }
    
            
            return { _id: productId, stock: stock - quantity };
        } catch (error) {
            throw new Error(`Error al actualizar stock: ${error.message}`);
        }
    }
    
    

    async deleteProduct(id) {
        try {
            
            const product = await productsModel.findByIdAndDelete(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product.toObject(); 
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

module.exports = ProductMangerMongo;
