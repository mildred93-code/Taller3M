const express = require("express");
const router = express.Router();
const PedidoService = require("../application/pedidoService");
const PedidoRepositoryAdapter = require("../infrastructure/pedidoRepositoryAdapter");

const pedidoRepository = new PedidoRepositoryAdapter();
const pedidoService = new PedidoService(pedidoRepository);

router.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await pedidoService.getPedidos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los pedidos", error: error.message });
  }
});

router.post("/pedidos", async (req, res) => {
  const { usuario_id, productos } = req.body;
  if (!usuario_id || !productos) {
    return res.status(400).json({ msg: "Faltan datos (usuario_id o productos)" });
  }

  try {
    const nuevoPedido = await pedidoService.createPedido(usuario_id, productos);
    res.status(201).json({ msg: "Pedido registrado con éxito", pedido: nuevoPedido });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.msg || "Error al registrar el pedido" });
  }
});

router.delete("/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pedidoService.deletePedido(id);
    res.json({ msg: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el pedido", error: error.message });
  }
});

module.exports = router;