const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");

//lista as entregas
router.get("/entregas", entregasController.listarEntregas);

//busca entregas
router.get("/entregas/:idEntrega", entregasController.buscarUm);

module.exports = { entregasRoutes: router };
