const { pedidosModel } = require("../models/pedidosModel");

const pedidosController = {

  // --------------------------
  // LISTAR TODOS OS PEDIDOS
  // --------------------------
  listarPedidos: async (req, res) => {
    try {
      const pedidos = await pedidosModel.listarPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ message: "Erro ao listar pedidos" });
    }
  },

  // --------------------------
  // CRIAR E CALCULAR UM PEDIDO
  // --------------------------
  criarPedidos: async (req, res) => {
    try {
      const { idCliente, tipoEntrega, distancia, pesoCarga, valorKm, valorKg } = req.body;

      if (!idCliente || !tipoEntrega || !distancia || !pesoCarga || !valorKm || !valorKg) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
      }

      
      // Fazer os cálculos
      const valorDistancia = (distancia) * (valorKm);
      const valorPeso = (pesoCarga) * (valorKg);
      
      let acrescimo = 0;
      if (tipoEntrega.toLowerCase() === "urgente") {
        acrescimo = (valorDistancia + valorPeso) * 0.2;
      }
      
      let desconto = 0;
      if (pesoCarga > 100) {
        desconto = (valorDistancia + valorPeso) * 0.1;
      }

      let taxaExtra = 0;
      if (distancia > 50) {
        taxaExtra = 25;
      }
      let statusEntrega = "Pendente";

      const valorFinal = valorDistancia + valorPeso + acrescimo - desconto + taxaExtra;
      
      // Criar o pedido no banco
      const novoPedido = await pedidosModel.criarPedidos(
        valorDistancia,
        valorPeso,
        acrescimo,
        desconto,
        taxaExtra,
        valorFinal,
        statusEntrega
      );

      res.status(201).json({
        message: "Pedido registrado e calculado com sucesso!",
        pedido: {
          idPedido: novoPedido.idPedido,
        valorDistancia,
        valorPeso,
        acrescimo,
        desconto,
        taxaExtra,
        valorFinal,
        statusEntrega,
          calculos: {
            valorDistancia,
            valorPeso,
            acrescimo,
            desconto,
            taxaExtra,
            valorFinal,
          }
        }
      });

    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao criar pedido." });
    }
  },

  // --------------------------
  // ATUALIZAR UM PEDIDO
  // --------------------------
  atualizarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;
      const { tipoEntrega, distancia, pesoCarga, valorKm, valorKg } = req.body;

      if (idPedido.length != 36) {
        return res.status(400).json({ erro: "Id do pedido inválido!" });
      }

      const pedido = await pedidosModel.buscarUm(idPedido);

      if (!pedido || pedido.length != 1) {
        return res.status(404).json({ erro: "Pedido não encontrado!" });
      }

      const pedidoAntigo = pedido[0];

      await pedidosModel.atualizarPedido(
        idPedido,
        tipoEntrega ?? pedidoAntigo.tipoEntrega,
        distancia ?? pedidoAntigo.distancia,
        pesoCarga ?? pedidoAntigo.pesoCarga,
        valorKm ?? pedidoAntigo.valorKm,
        valorKg ?? pedidoAntigo.valorKg
      );

      res.status(200).json({ message: "Pedido atualizado com sucesso!" });

    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao atualizar pedido." });
    }
  },

  // --------------------------
  // DELETAR UM PEDIDO
  // --------------------------
  deletarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;

      if (idPedido.length != 36) {
        return res.status(400).json({ erro: "Id do pedido inválido!" });
      }

      await pedidosModel.deletarPedido(idPedido);
      res.status(200).json({ message: "Pedido excluído com sucesso!" });

    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao excluir pedido." });
    }
  }
};

module.exports = { pedidosController };
