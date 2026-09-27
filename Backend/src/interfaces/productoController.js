const express = require("express");
const router = express.Router();
const ProductoService = require("../application/productoService");
const ProductoRepositoryAdapter = require("../infrastructure/productoRepositoryAdapter");

const productoRepository = new ProductoRepositoryAdapter();
const productoService = new ProductoService(productoRepository);

router.get("/productos", async (req, res) => {
  try {
    const productos = await productoService.getProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los productos", error: error.message });
  }
});

router.post("/productos", async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ msg: "Faltan datos obligatorios (nombre, precio, stock)" });
  }

  try {
    const nuevoProducto = await productoService.createProducto(nombre, descripcion, precio, stock);
    res.status(201).json({ msg: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.msg || "Error al crear el producto" });
  }
});

router.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  try {
    const actualizado = await productoService.updateProducto(id, nombre, descripcion, precio, stock);
    res.json({ msg: "Producto actualizado", producto: actualizado });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el producto", error: error.message });
  }
});

router.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await productoService.deleteProducto(id);
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el producto", error: error.message });
  }
});

module.exports = router;