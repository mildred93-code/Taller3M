class PedidoService {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async getPedidos() {
    return await this.pedidoRepository.findAll();
  }

  async createPedido(usuario_id, productos) {
    if (!productos || productos.length === 0) {
      throw { status: 400, msg: "El pedido debe contener al menos un producto" };
    }
    return await this.pedidoRepository.save(usuario_id, productos);
  }

  async deletePedido(id) {
    return await this.pedidoRepository.delete(id);
  }
}

module.exports = PedidoService;