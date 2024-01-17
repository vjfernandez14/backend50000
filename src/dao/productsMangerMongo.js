const mongoose = require('mongoose');
const productsModel = require('../models/products.model')


class ProductMangerMongo {

    async addProduct(title, description, price, stock, code, status, category, thumbnail) {
        try {
            if (!title || !description || !price || !status || !stock || !code || !category) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Verificar si ya existe un producto con el mismo código
            const existingProduct = await productsModel.findOne({ code: code });
            if (existingProduct) {
                throw new Error('Ya existe un producto con el mismo código');
            }

            // Crear un nuevo documento basado en el modelo
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

            // Guardar el nuevo producto en la base de datos
            await newProduct.save();

            return newProduct.toObject(); // Devolver el objeto del producto creado
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async getProducts() {
        try {
            // Obtener todos los productos de la base de datos
            const products = await productsModel.find();
            return products.map(product => product.toObject()); // Devolver los objetos de productos
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            // Buscar un producto por su ID en la base de datos
            const product = await productsModel.findById(id);
            
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product.toObject(); // Devolver el objeto del producto encontrado
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }

    async updateProduct(id, title, description, price, code, stock, status, category, thumbnail) {
        try {
            // Buscar un producto por su ID en la base de datos
            const product = await productsModel.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Actualizar los campos del producto
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

    async deleteProduct(id) {
        try {
            // Eliminar un producto por su ID de la base de datos
            const product = await productsModel.findByIdAndDelete(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product.toObject(); // Devolver el objeto del producto eliminado
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

module.exports = ProductMangerMongo;
