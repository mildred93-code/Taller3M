const express = require("express");
const router = express.Router();
const UserService = require("../application/userService");
const userService = new UserService();

router.get("/usuarios", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error al consultar los usuarios" });
  }
});

router.post("/usuarios", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  try {
    await userService.registerUser(nombre, email, password);
    res.status(201).json({ msg: "Usuario registrado" });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ msg: error.msg });
    }
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Faltan datos de acceso" });
  }

  try {
    const user = await userService.loginUser(email, password);
    res.json({ msg: "¡Bienvenido!", user });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.msg || "Error en el servidor", error: error.message });
  }
});

router.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  try {
    await userService.updateUser(id, nombre, email, password);
    res.json({ msg: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el usuario", error: error.message });
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    res.json({ msg: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el usuario", error: error.message });
  }
});

module.exports = router;