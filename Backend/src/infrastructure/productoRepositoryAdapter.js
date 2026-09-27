const pool = require("./db");

class ProductoRepositoryAdapter {
  async findAll() {
    const result = await pool.query("SELECT * FROM productos");
    return result.rows;
  }

  async save(nombre, descripcion, precio, stock) {
    const result = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, descripcion, precio, stock]
    );
    return result.rows[0];
  }

  async update(id, nombre, descripcion, precio, stock) {
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4 WHERE id = $5 RETURNING *",
      [nombre, descripcion, precio, stock, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    await pool.query("DELETE FROM productos WHERE id = $1", [id]);
  }
}

module.exports = ProductoRepositoryAdapter;