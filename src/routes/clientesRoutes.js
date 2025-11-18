const express = require("express");
const router = express.Router();
const {clienteController} = require("../controllers/clientesController")

//GET/ produtos -> lista todos os produtos
router.get("/clientes", clienteController.listarClientes);

//POST/produtos -> cria um novo produto
router.post("/clientes",clienteController.criarCliente)

// PUT/ clientes/ idCliente -> busca o cliente pelo id e atualiza ele
router.put("/clientes/:idCliente", clienteController.atualizarCliente)

// DELETE/ clientes/ idCliente -> busca o cliente pelo id e deleta
router.delete("/clientes/:idCliente", clienteController.deletarCliente)

module.exports = {clientesRoutes : router};