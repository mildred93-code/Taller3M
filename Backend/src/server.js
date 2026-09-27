require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Importar y usar controladores
const userRoutes = require("./interfaces/userController");
const productoController = require("./interfaces/productoController");
const pedidoController = require("./interfaces/pedidoController");

app.use("/", userRoutes);
app.use("/", productoController);
app.use("/", pedidoController);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});