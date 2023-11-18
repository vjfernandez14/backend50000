class ProductManager {

    constructor(products=[]) {
        this.products = products;
        this.nextId = 1; 
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

        this.nextId++;

        return console.log('Producto creado')
    
    }

    getProducts(){
         return console.log(this.products)   
    }

    getProductById(id){
        const productsFound = this.products.find(products => products.id === id);

        if(productsFound)  return console.log(productsFound)

        console.log('Not found')
    }

 }
const productCreate = new ProductManager();

//productCreate.addProduct('Laptop','hp ryzen 5500',800,'ruta',10,1);
//productCreate.addProduct('Laptop','DELL ryzen 5500',800,'ruta',10,2);
//productCreate.getProducts();
//productCreate.getProductById(3);
