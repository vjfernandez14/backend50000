const express = require("express");
const productsModel = require("../models/products.model");


const router = express.Router();



router.get('/Telefonia', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(
            { category: "Telefonia" },
            { page, limit: 10, lean: true }
        );

        const telefonia = docs;
        console.log(telefonia);

        res.render("telefonia.handlebars", {
            telefonia,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
        });
    } catch (error) {
        console.error("Error al obtener productos de Telefonia:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;