const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const info = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(info)
            } else {
                return []
            }
        } catch (error) {
            return error
        }
    }

    async codeValidator(arr, newCode){
        let prodExists = await arr.find( prod => prod.code === newCode)
        return prodExists ? true : false
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            let info = await this.getProducts()
            if(await this.codeValidator(info, code)){
                return "Error! El código identificador del producto ya existe. Revisar el producto."
            } else {
                const prod = {
                    id: info.length ? info[info.length - 1].id + 1 : 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                info.push(prod)
                await fs.promises.writeFile(this.path, JSON.stringify(info))
            }
        } catch (error) {
            return error
        }
    }

    async getProductById(id) {
        try {
            const info = await this.getProducts()
            const search = info.find(prod => prod.id === id)
            return (search ? search : "No se encontró ningún producto con ese ID.")
        } catch (error) {
            return error
        }
    }

    async deleteProduct(id) {
        try {
            let info = await this.getProducts()
            let newInfo = info.filter(prod => prod.id !== id)
            if(newInfo.length === info.length){
                console.error("Error! El producto que desea eliminar no existe. Verifique el ID ingresado")
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify(newInfo))
            }
        } catch (error) {
            return error
        }
    }

    async updateProduct(id, changes) {
        try {
            let productsList = await this.getProducts()
            let info = await this.getProductById(id)
            let newInfo = { ...info, ...changes }
            productsList[id - 1] = { ...productsList[id - 1], ...newInfo }
            await fs.promises.writeFile(this.path, JSON.stringify(productsList))
        } catch (error) {
            return error
        }
    }

}

/*************************
 TEST DEL PRODUCT MANAGER.
*************************/
async function test() {

    // Se creará una instancia de la clase “ProductManager”
    const producto1 = new ProductManager('Products.json')

    // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    let productList = await producto1.getProducts()
    console.log("~~~~~~~~~~~~~~ Lista de productos vacía | Test 1/6 ~~~~~~~~~~~~~~")
    console.log(productList)

    // Se llamará al método “addProduct” con los campos:
    //     title: “producto prueba”
    //     description:”Este es un producto prueba”
    //     price:200,
    //     thumbnail:”Sin imagen”
    //     code:”abc123”,
    //     stock:25
    // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
    await producto1.addProduct('Producto prueba 1', 'Este es un producto prueba', 200, 'Sin Imagen', 'abc123', 25)
    await producto1.addProduct('Producto prueba 2', 'Este es un producto prueba', 400, 'Sin Imagen', 'def456', 35)
    await producto1.addProduct('Producto prueba 3', 'Este es un producto prueba', 600, 'Sin Imagen', 'ghi789', 45)

    // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
    productList = await producto1.getProducts()
    console.log("~~~~~~~~~~~~~~ Lista de productos después de haber agregado los productos | Test 2/6 ~~~~~~~~~~~~~~")
    console.log(productList)

    // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
    let prodById = await producto1.getProductById(1)
    console.log("~~~~~~~~~~~~~~ Producto buscado por ID que SI existe en el archivo | Test 3/6 ~~~~~~~~~~~~~~")
    console.log(prodById);

    prodById = await producto1.getProductById(10)
    console.log("~~~~~~~~~~~~~~ Producto buscado por ID que NO existe en el archivo | Test 4/6 ~~~~~~~~~~~~~~")
    console.log(prodById);

    // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
    await producto1.updateProduct(1, {title: 'Producto modificado', stock: 10000})
    productList = await producto1.getProducts()
    console.log("~~~~~~~~~~~~~~ Lista de productos con el producto modificado (Producto ID 1 Modificado) (Update Function) | Test 5/6 ~~~~~~~~~~~~~~")
    console.log(productList)

    // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
    await producto1.deleteProduct(2)
    productList = await producto1.getProducts()
    console.log("~~~~~~~~~~~~~~ Lista de productos con el producto eliminado(id 2) (Delete Function) | Test 6/7 ~~~~~~~~~~~~~~")
    console.log(productList)

    console.log("~~~~~~~~~~~~~~ Intento fallido de eliminar un producto que no existe | Test 7/7 ~~~~~~~~~~~~~~")
    await producto1.deleteProduct(10)
}
test()
