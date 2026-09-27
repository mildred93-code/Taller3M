class Pedido {
  constructor(id, usuarioId, total, fecha, productos = []) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.total = total;
    this.fecha = fecha;
    this.productos = productos;
  }
}

module.exports = Pedido;