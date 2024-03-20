const {faker} = require('@faker-js/faker')

const generateProducts = (numProducts) => {
    const products = []

    for (let i = 0; i < numProducts; i++) {
        products.push(generateProduct())
        
    }

    return products
}

const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 10, max: 100}),
        code: faker.finance.pin({length: 6}),
        status: true,
        category: faker.commerce.productAdjective(),
        thumbnail: faker.image.urlLoremFlickr(),

    }
}

module.exports = {
    generateProduct,
    generateProducts,
}