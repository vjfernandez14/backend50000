const fs = require('fs');


class ProductManager {
    
    constructor(ruta) {
        this.products = [];
        this.nextId = 1; 
        this.path = ruta;
    }

    async addProduct(title, description, price, stock, code, status, category, thumbnail) {

        if (!title || !description || !price || !status || !stock || !code || !category) {
         console.log(title)
         return console.log('Todos los campos son obligatorios');
        } 
      
        const products = await this.getProducts();
      
        this.nextId = products.length +1 
      
        if (products.some(product => product.code === code)) {
            throw new Error('Ya existe un producto con el mismo código');
        } 
      
        const newProduct = {
         id: this.nextId,
         title,
         description,
         price,
         status,
         stock,
         code,
         category,
         thumbnail
      
        }; 
      
        products.push(newProduct);
      
        try {
      
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                this.nextId++;
                return newProduct;
        } catch (error) {
                 throw new Error(error);
        }
      
         
      
       }
    

    async getProducts(){
        
        let products= []
        try {
           const data = await fs.promises.readFile(this.path,'utf-8');
           products = JSON.parse(data);
           
           return products
        } catch (error) { 
            return products
        }          
    }



    async getProductById(id) {
        
        try {
            const data = await this.getProducts();     
            const productFound = data.find(product => product.id === id);
              
            if (productFound) {
                //console.log(productFound)
                return productFound;
            } else {
                throw new Error('Product Not found');
            }
        } catch (error) { 
            throw new Error('No se encontró el producto');
        }
    }
    

    async updateProduct(id, title, description, price, code, stock, status, category, thumbnail) {
        try {
            const resultado = await this.getProducts();
            //this.products = JSON.parse(resultado);
            
            const productsFound = resultado.find(product => product.id === id);
            if (!productsFound) {
                throw new Error('Product Not found');
                return null;
            }

            const indexProducts = resultado.findIndex(product => product.id === id);

            (title) ? productsFound.title = title : "";
            (description) ? productsFound.description = description : "";
            (price) ? productsFound.price = price : "";
            (thumbnail) ? productsFound.thumbnail = thumbnail : "";
            (code) ? productsFound.code = code : "";
            (stock) ? productsFound.stock = stock : "";
            (status) ? productsFound.status = status : "";
            (category) ? productsFound.category = category : "";

            resultado[indexProducts] = productsFound;
            
            const productsJSON = JSON.stringify(resultado);
            
            await fs.promises.writeFile(this.path, productsJSON);
            
            return productsFound;
        } catch (error) {
            throw new Error('Error al actualizar producto');
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const resultado = await this.getProducts();
            

            const productsFound = resultado.find(product => product.id === id);

            if (!productsFound) {
                throw new Error('Product Not found');
                return null;
            }

            const indexProducts = resultado.findIndex(product => product.id === id);

            resultado.splice(indexProducts, 1);

            const productsJSON = JSON.stringify(resultado);

            await fs.promises.writeFile(this.path, productsJSON);

            return productsFound;
        } catch (error) {
            throw new Error('Error al eliminar producto');
            return null;
        }
    }
}
const productCreate = new ProductManager('./products.json');

//productCreate.addProduct('Laptop','hp ryzen 5500',800,'ruta',10,12);
//productCreate.addProduct('Laptop','DELL ryzen 5500',800,'ruta',10,2);
  
//productCreate.getProductById(2); 
//productCreate.updateProduct(2,'nuevo titulos','otra marca');
//productCreate.deleteProduct(2);
//productCreate.getProducts()
 
module.exports = ProductManager;