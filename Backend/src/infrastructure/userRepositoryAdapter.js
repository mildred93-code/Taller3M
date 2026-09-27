const pool = require("./db");

class UserRepositoryAdapter {
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    return result.rows[0];
  }

  async save(nombre, email, passwordHash) {
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)",
      [nombre, email, passwordHash]
    );
  }

  async findAll() {
    const result = await pool.query("SELECT id, nombre, email FROM usuarios");
    return result.rows;
  }

  async update(id, nombre, email, passwordHash) {
    await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2, password = $3 WHERE id = $4",
      [nombre, email, passwordHash, id]
    );
  }

  async delete(id) {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }
}

module.exports = UserRepositoryAdapter;