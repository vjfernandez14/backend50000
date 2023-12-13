const fs = require('fs');


class ProductManager {
    
    constructor(ruta) {
        this.products = [];
        this.nextId = 1; 
        this.path = ruta;
    }

    addProduct(title, description, price, stock, code, status, category, thumbnail) {
        if (!title || !description || !price || !status || !stock || !code || !category) {
            console.log(title)
            return console.log('Todos los campos son obligatorios');
        }
    
        // Lee el archivo y actualiza this.products
        fs.readFile(this.path, 'utf-8', (error, data) => {
            if (error) {
                console.log('Error al leer el archivo:', error.message);
                return;
            }
    
            try {
                this.products = JSON.parse(data);

                this.nextId = this.products.length;
                ++this.nextId;
                console.log(this.nextId);
    
                // Verifica si ya existe un producto con el mismo código
                const codeFind = this.products.find(product => product.code === code);
    
                if (codeFind) {
                    return console.log('Ya existe el código ingresado');
                }
    
                // Crea el nuevo producto
                const newProduct = {
                    id: this.nextId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category
                };
    
                // Agrega el nuevo producto al array
                this.products.push(newProduct);
    
                // Actualiza el archivo JSON con el array actualizado
                const productsJSON = JSON.stringify(this.products);
                fs.writeFile(this.path, productsJSON, (writeError) => {
                    if (writeError) {
                        console.log('Error al escribir en el archivo:', writeError.message);
                    } else {
                        // Incrementa el ID para el próximo producto
                        
                        console.log('Producto agregado correctamente');
                    }
                });
            } catch (parseError) {
                console.log('Error al parsear el archivo JSON:', parseError.message);
            }
        });
    }
    

    async getProducts(){
        
        let products= []
        try {
           const data = await fs.promises.readFile(this.path,'utf-8');
           products = JSON.parse(data);
           console.log(products)
           return products
        } catch (error) { 
            return products
        }          
    }



    async getProductById(id) {
        
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const productFound = products.find(product => product.id === id);
                
            if (productFound) {
                console.log(productFound)
                return productFound;
            } else {
               return console.log( 'Not found');
            }
        } catch (error) {
            throw new Error('No se encontró el producto');
        }
    }
    

    updateProduct (id,title,description,price,code,stock,status,category,thumbnail){
        fs.readFile(this.path,'utf-8',(error,resultado)=>{
                
            if(error) return console.log('Error al buscar los datos');
                console.log(id)
                this.products = JSON.parse(resultado);
                const productsFound = this.products.find(products => products.id === Number(id));

                //! comprobamos si encontro un objeto con dicho id
                if (!productsFound)  return console.log('no existe el producto, que quiere modificar');

                // guardamos el indice del id que seleccionamos
                const indexProducts = this.products.findIndex(products => products.id === id);

                //usamos el ternario para comprobar que nos dieron como parametro, asi cambiamos solo lo pedido.
                    (title) ? productsFound.title = title : ""; 
                    (description) ? productsFound.description = description : "";
                    (price) ? productsFound.price = price : "";
                    (thumbnail) ? productsFound.thumbnail = thumbnail : "";
                    (code) ? productsFound.code = code : "";
                    (stock) ? productsFound.stock = stock : "";
                    (status) ? productsFound.status = status : "";
                    (category) ? productsFound.category = category : "";

        
                const newProduct = productsFound;
                this.products[indexProducts] = newProduct;
                
                    //escribimos el nuevo array en nuestro archivo
                    const productsJSON = JSON.stringify(this.products);
        
                    fs.writeFile(this.path,productsJSON,(error)=>{
                         if(error) return console.log('Error al agregar producto');
                    });

                if(productsFound)  return productsFound
                
                    console.log('Not found')
                
            
        });
        
    }

    deleteProduct(id) {
        fs.readFile(this.path,'utf-8',(error,resultado)=>{
                
            if(error) return console.log('Error al buscar los datos');
                
                this.products = JSON.parse(resultado);
                const productsFound = this.products.find(products => products.id === Number(id));
                if (!productsFound)  return console.log('no existe el producto, que quiere eliminar');

                // Guardamos el indicie del producto que se quiere eliminar
                const indexProducts = this.products.findIndex(products => products.id === id);

                //borramos el producto con el id correspondiente.
                this.products.splice(indexProducts,1);

                //Convertimos en JSON y registramos el array actualizado. 
                const productsJSON = JSON.stringify(this.products);
        
                fs.writeFile(this.path,productsJSON,(error)=>{
                     if(error) return console.log('Error al agregar producto');
                });

        })
     }
 }
const productCreate = new ProductManager('./products.json');

//productCreate.addProduct('Laptop','hp ryzen 5500',800,'ruta',10,12);
//productCreate.addProduct('Laptop','DELL ryzen 5500',800,'ruta',10,2);
  
productCreate.getProductById(2); 
//productCreate.updateProduct(2,'nuevo titulos','otra marca');
//productCreate.deleteProduct(2);
//productCreate.getProducts()
 
module.exports = ProductManager;