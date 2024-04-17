const mongoose = require("mongoose");
const productsModel = require("../models/products.model");

const isOwner = async (req,res,next) => {
    try {
        if(req.method !== 'DELETE' &&  req.method !== 'PUT'){
            return next()
        }

        if(!req.user){
            return res.status(401).json({message: 'No estas autenticado'})
        }

        const productId = req.params.id

        const product = await productsModel.findById(productId)

        if(!product){
            return res.status(404).json({message: 'Producto no encontrado'})
        }

        if(String(product.owner) !== String(req.user._id)){
            return res.status(403).json({message: 'No tienes autorizacion sobre este producto'})
        }

        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = isOwner