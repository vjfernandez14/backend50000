import * as chai from 'chai';
import { it } from "mocha";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing products', () => {
    xit('El endpoint POST api/products debe crear un producto correctamente', async () => {
        const productMock = { 
            title: 'PS5',
            description: 'Consola de videojuego Sony',
            price: 1200,
            stock: 25,
            code: 86,
            status: true,
            category: 'Tecnologia',
            thumbnail: 'imagen.jpg'
        };
        const response = await requester.post('/api/products/updateProducts').send(productMock);

        console.log(response._body);
        expect(response._body.product).to.have.property("status").to.be.true;


    });
});

describe('Testing mockingproducts endpoint', () => {
    it('El endpoint GET /mockingproducts debe devolver los productos generados', async () => {
        const response = await requester.get('/api/products/mockingproducts');

        expect(response.status).to.equal(200);
        
    });
});

describe('Testing product creation with missing fields', () => {
    it('El endpoint POST /api/products/updateProducts debe responder con código de estado 400 cuando faltan campos obligatorios', async () => {
        const productMock = { 
            description: 'Consola de videojuego Sony',
            price: 1200,
            stock: 25,
            code: 88,
            status: true,
            category: 'Tecnologia',
            thumbnail: 'imagen.jpg'
        };

        const response = await requester.post('/api/products/updateProducts').send(productMock);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error').to.equal('Todos los campos son obligatorios');
    });
});


describe('Testing CartsController', () => {
    it('Debe crear un nuevo carrito', async () => {
        const response = await requester.post('/api/carts/');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
    });

    it('Debe obtener todos los carritos', async () => {
        const response = await requester.get('/api/carts/');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });


    it('Debe agregar un producto a un carrito', async () => {
        const cartsResponse = await requester.get('/api/carts/');
        const cartId = cartsResponse.body[0]._id;

        const productMock = { 

            _id: "65a753afe40c5d14271c2f89",
            description: 'Consola de videojuego Sony',
            price: 1200,
            stock: 25,
            code: 88,
            status: true,
            category: 'Tecnologia',
            thumbnail: 'imagen.jpg'
        };
        const quantity = 1;

        const response = await requester.post(`/api/carts/${cartId}/product/${productMock._id}`).send({ quantity });
        expect(response.status).to.equal(302)
    });

});


describe('Testing session Controller', () => {
    it('Debe verificar que el mail exista', async () => {
        const userMock = {
            email: 'victorjosefernandezviloria@gmail.com',
            password: '123456',
        }

        const response = await requester.post('/api/users/login').send(userMock)
        expect(response.status).to.equal(302)
    })

    it('Debe verificar que se genera un token de autenticacion al hacer login', async () => {
        const userMock = {
            email: 'victorjosefernandezviloria@gmail.com',
            password: '123456',
        }

        const response = await requester.post('/api/users/login').send(userMock)
        expect(response.header).to.have.property('set-cookie');
    })
})