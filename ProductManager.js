const fs = require('fs');

class ProductManager {
    
    constructor(ruta) {
        this.products = [];
        this.nextId = 1; 
        this.path = ruta;
    }

    addProduct(title, description, price,thumbnail,stock,code){

        if(!title || !description || !price || !thumbnail || !stock || !code) return console.log('Todos los campos son obligatorios')

        const codeFind = this.products.find(products => products.code === code)

        if (codeFind) return console.log('Ya existe el codigo ingresado')

        const newProduct = {
            id: this.nextId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);

        const productsJSON = JSON.stringify(this.products);
        
        fs.writeFile(this.path,productsJSON,(error)=>{
            if(error) return console.log('Error al agregar producto');
        });


        this.nextId++;
    
    }

    getProducts(){
        
        fs.readFile(this.path,'utf-8',(error,resultado)=>{
            if(error) {
                return console.log(this.products)
            } else{
                if (!this.products) return console.log('No se pudo obtener los productos')
                this.products = JSON.parse(resultado);
                return this.products;
            }
        });
          
    }

     getProductById(id){

        
            fs.readFile(this.path,'utf-8',(error,resultado)=>{
                
                if(error) return console.log('Error al buscar los datos');
                    
                //parseamos los datos extraidos 
                    this.products = JSON.parse(resultado);
                    const productsFound = this.products.find(products => products.id === id);

                    if(productsFound)  return productsFound
                        
                        console.log('Not found')
                    
                
            });

        
    }

    updateProduct (id,title,description,price,thumbnail,code,stock){
        fs.readFile(this.path,'utf-8',(error,resultado)=>{
                
            if(error) return console.log('Error al buscar los datos');
                
                this.products = JSON.parse(resultado);
                const productsFound = this.products.find(products => products.id === id);

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
                const productsFound = this.products.find(products => products.id === id);
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

//productCreate.addProduct('Laptop','hp ryzen 5500',800,'ruta',10,1);
//productCreate.addProduct('Laptop','DELL ryzen 5500',800,'ruta',10,2);

//productCreate.getProductById(2); 
//productCreate.updateProduct(2,'nuevo titulos','otra marca');
//productCreate.deleteProduct(2);
//productCreate.getProducts()