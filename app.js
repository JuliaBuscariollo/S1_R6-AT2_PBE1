const express = require("express");
require("dotenv").config();
const app = express();
const {clientesRoutes} = require("./src/routes/clientesRoutes");
const {pedidosRoutes} = require("./src/routes/pedidosRoutes");
const {entregasRoutes} = require("./src/routes/entregasRoutes");
const PORT = process.env.PORT;

app.use(express.json());

app.use('/', clientesRoutes);
app.use('/', pedidosRoutes);
app.use('/', entregasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor Rodando em http://localhost:${PORT}`);
});
