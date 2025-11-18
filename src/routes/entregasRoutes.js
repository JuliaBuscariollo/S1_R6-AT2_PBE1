const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");

//lista as entregas
router.get("/entregas", entregasController.listarEntregas);

//busca entregas
router.get("/entregas/:id", entregasController.buscarEntrega);

module.exports = { entregasRoutes: router };
