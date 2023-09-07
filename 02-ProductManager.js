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

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            let info = await this.getProducts()
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
        } catch (error) {
            return error
        }
    }

    async getProductById(id) {
        try {
            const info = await this.getProducts()
            const search = info.find( prod => prod.id === id )
            return (search ? search : "No se encontró ningún producto con ese ID.")
        } catch (error) {
            return error
        }
    }

    async deleteProduct(id) {
        try {
            let info = await this.getProducts()
            let newInfo = info.filter( prod => prod.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newInfo))
        } catch (error) {
            return error
        }
    }

    async updateProduct(id, changes) {
        try {
            let info = await this.getProductById(id)
            let newInfo = [...info, ...changes]
            console.log(newInfo)
        } catch (error) {
            return error
        }
    }

}

async function test(){
    const producto1 = new ProductManager('Products.json')

    // GET PRODUCTS 
    // let list = await producto1.getProducts()
    // console.log(list)

    // ADD PRODUCTS
    await producto1.addProduct('Producto prueba1', 'Este es un producto prueba', 100, 'Sin Imagen', 'aaa111', 10)
    await producto1.addProduct('Producto prueba2', 'Este es un producto prueba', 200, 'Sin Imagen', 'bbb222', 20)
    await producto1.addProduct('Producto prueba3', 'Este es un producto prueba', 300, 'Sin Imagen', 'ccc333', 30)
    
    // GET PRODUCTS BY ID
    let search = await producto1.getProductById(1);
    console.log(search)

    // UPDATE PRODUCTS
    await producto1.updateProduct(1, {title: 'Prod Nuevo', stock: 18})

    // GET PRODUCTS 
    let list = await producto1.getProducts()
    console.log(list)


    // DELETE PRODUCTS 
    // await producto1.deleteProduct(1)
}
test()
