const pool = require("./db");

class PedidoRepositoryAdapter {
  async findAll() {
    const result = await pool.query(`
      SELECT p.id, p.total, p.fecha, u.nombre as usuario 
      FROM pedidos p 
      JOIN usuarios u ON p.usuario_id = u.id
    `);
    return result.rows;
  }

  async save(usuario_id, productos) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Calcular el total y crear el pedido
      let total = 0;
      for (let item of productos) {
        const prodRes = await client.query("SELECT precio FROM productos WHERE id = $1", [item.producto_id]);
        if (prodRes.rows.length === 0) throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
        total += prodRes.rows[0].precio * item.cantidad;
      }

      const pedidoRes = await client.query(
        "INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING *",
        [usuario_id, total]
      );
      const pedidoId = pedidoRes.rows[0].id;

      // 2. Insertar los productos del pedido y descontar stock
      for (let item of productos) {
        await client.query(
          "INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES ($1, $2, $3)",
          [pedidoId, item.producto_id, item.cantidad]
        );
        await client.query(
          "UPDATE productos SET stock = stock - $1 WHERE id = $2",
          [item.cantidad, item.producto_id]
        );
      }

      await client.query("COMMIT");
      return { id: pedidoId, usuario_id, total };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    await pool.query("DELETE FROM pedidos WHERE id = $1", [id]);
  }
}

module.exports = PedidoRepositoryAdapter;