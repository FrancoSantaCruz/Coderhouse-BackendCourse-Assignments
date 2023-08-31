class ProductManager{
    constructor(){
        this.productList = []
    }
    codeValidator(newCode){
        let prodExists = this.productList.find( prod => prod.code === newCode)
        return prodExists ? true : false
    }
    addProduct(title, description, price, thumbnail,code,stock){
        if(!this.codeValidator(code)){
            const product = {
                id: this.productList.length ? this.productList[this.productList.length-1].id +1 : 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            }
    
            this.productList.push(product)
        } else {
            console.error("ERROR! Código repetido. Ya existe este producto.")
        }
    }
    getProducts(){
        return this.productList;
    }
    getProductById(prodId){
        const selectedProd = this.productList.find( prod => prod.id === prodId)
        return selectedProd ? selectedProd : "El producto que está buscando no existe 😥 Controle bien el ID que ingresó.";
    }
}

// Se creará una instancia de la clase “ProductManager”
const producto1 = new ProductManager()

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
console.log(producto1.getProducts())

// Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25
// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
producto1.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)

// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
console.log(producto1.getProducts())

// Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
producto1.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)

// Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
console.log(producto1.getProductById(1))

console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
console.log(producto1.getProductById(9))