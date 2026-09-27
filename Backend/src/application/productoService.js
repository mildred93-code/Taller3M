const UserRepositoryAdapter = require("../infrastructure/userRepositoryAdapter");

class ProductoService {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async getProductos() {
    return await this.productoRepository.findAll();
  }

  async createProducto(nombre, descripcion, precio, stock) {
    if (precio < 0 || stock < 0) {
      throw { status: 400, msg: "El precio y el stock no pueden ser negativos" };
    }
    return await this.productoRepository.save(nombre, descripcion, precio, stock);
  }

  async updateProducto(id, nombre, descripcion, precio, stock) {
    return await this.productoRepository.update(id, nombre, descripcion, precio, stock);
  }

  async deleteProducto(id) {
    return await this.productoRepository.delete(id);
  }
}

module.exports = ProductoService;