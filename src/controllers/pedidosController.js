const { clienteModel } = require("../models/clientesModel");
const { entregasModel } = require("../models/entregasModel");
const { pedidosModel } = require("../models/pedidosModel");

const pedidosController = {

  // Listar todos os pedidos

   // GET /pedidos

  /**
   * controlador lista todos os pedidos do banco de dados
   *
   * @async
   * @function: listar pedidos
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de pedidos
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os pedidos
   */
 
  listarPedidos: async (req, res) => {
    try {

      const { idPedido } = req.query;

      if (idPedido) {
        const pedido = await pedidosModel.buscarUm(idPedido);
        if (!pedido || pedido.length === 0) {
          return res.status(404).json({ erro: "Pedido não encontrado!" });
        }
        return res.status(200).json(pedido);
      }

      const pedidos = await pedidosModel.listarPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ message: "Erro ao listar pedidos" });
    }
  },

 
  // Criar e calcular um pedido 

  // POST /pedidos

  /**
   * controlador cria os pedidos do banco de dados
   *
   * @async
   * @function: criar pedidos
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma mensagem de cadastro bem-sucedido
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os pedidos
   */
 

  criarPedidos: async (req, res) => {
    try {
      const {
        idCliente,
        dataPedido,
        distancia,
        pesoCarga,
        tipoEntrega,
        valorKm,
        valorKg,
      } = req.body;

      if (
        !idCliente ||
        !dataPedido ||
        !tipoEntrega ||
        !distancia ||
        !pesoCarga ||
        !valorKm ||
        !valorKg
      ) {
        return res
          .status(400)
          .json({ erro: "Preencha todos os campos obrigatórios." });
      }

      if (
        isNaN(valorKm) ||
        isNaN(valorKg) ||
        isNaN(distancia) ||
        isNaN(pesoCarga)
      ) {
        return res.status(400).json({ erro: "Dados inválidos!" });
      }
      // Fazer os cálculos da entrega - em caso do peso ser maior que 50, a taxa extra é fixa de 15 reais.
      const valorDistancia = distancia * valorKm;
      const valorPeso = pesoCarga * valorKg;

      let acrescimo = 0;
      if (tipoEntrega.toLowerCase() === "urgente") {
        acrescimo = (valorDistancia + valorPeso) * 0.2;
      }

      let taxaExtra = 0;
      if (distancia > 50) {
        taxaExtra = 15;
      }

      let valorFinal = valorDistancia + valorPeso + acrescimo + taxaExtra;

      let desconto = 0;
      if (valorFinal > 500) {
        desconto = valorFinal * 0.1;
        valorFinal = valorFinal - desconto;
      }

      let statusEntrega = "Calculado";

      // Criar o pedido no banco de dados
      await pedidosModel.criarPedido(
        idCliente,
        dataPedido,
        distancia,
        pesoCarga,
        tipoEntrega,
        valorKg,
        valorKm,
        acrescimo,
        desconto,
        statusEntrega,
        taxaExtra,
        valorDistancia,
        valorFinal,
        valorPeso
      );

      res.status(201).json({
        message: "Pedido registrado e calculado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao criar pedido." });
    }
  },

  // Atualizar um pedido 

  // PUT /pedidos

  /**
   * controlador atualiza os pedidos do banco de dados
   *
   * @async
   * @function: atualizar pedidos
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de pedidos
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os pedidos
   */
 
  atualizarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;
      const {
        idCliente,
        dataPedido,
        tipoEntrega,
        distancia,
        pesoCarga,
        valorKm,
        valorKg,
        statusEntrega,
      } = req.body;

      if (idPedido.length != 36) {
        return res.status(400).json({ erro: "Id do pedido inválido!" });
      }

      const pedido = await pedidosModel.buscarUm(idPedido);

      if (!pedido || pedido.length != 1) {
        return res.status(404).json({ erro: "Pedido não encontrado!" });
      }

      const pedidoAntigo = pedido[0];

      const entregaAntiga = await entregasModel.buscarUm(idPedido);
      console.log(entregaAntiga);
      

      if (idCliente) {
        if (idCliente.length != 36) {
          return res.status(400).json({ erro: "Id do cliente inválido!" });
        }

        const cliente = clienteModel.buscarUm(idCliente);

        if (!cliente || cliente.length != 1) {
          return res.status(404).json({ erro: "Cliente não encontrado!" });
        }
      }

      if (statusEntrega) {
        if (
          statusEntrega != "calculado" &&
          statusEntrega != "em transito" &&
          statusEntrega != "entregue" &&
          statusEntrega != "cancelado"
        ) {
          return res.status(400).json({ erro: "Status de entrega inválido!" });
        }
      }
 
      const idClienteAtualizado = idCliente ?? pedidoAntigo.idCliente;
      const dataPedidoAtualizada = dataPedido ?? pedidoAntigo.dataPedido;
      const tipoEntregaAtualizada = tipoEntrega ?? pedidoAntigo.tipoEntrega;
      const distanciaAtualizado = distancia ?? pedidoAntigo.distancia;
      const pesoCargaAtualizada = pesoCarga ?? pedidoAntigo.pesoCarga;
      const valorKmAtualizado = valorKm ?? pedidoAntigo.valorKm;
      const valorKgAtualizado = valorKg ?? pedidoAntigo.valorKg;
      const statusEntregaAtualizado =
        statusEntrega ?? entregaAntiga.statusEntrega;
      const valorDistanciaAtualizado = distanciaAtualizado * valorKmAtualizado;
      const valorPesoAtualizado = pesoCargaAtualizada * valorKgAtualizado;
    

      // se a entrega for urgente, ou se o pedido exceder o peso máximo, o acréscimo é calculado:
      let acrescimoAtualizado = 0;
      if (tipoEntregaAtualizada.toLowerCase() === "urgente") {
        acrescimoAtualizado = (valorDistanciaAtualizado + valorPesoAtualizado) * 0.2;
      }

      let taxaExtraAtualizada = 0;
      if (pesoCargaAtualizada > 50) {
        taxaExtraAtualizada = 15;
      }

      //valor final

      let valorFinalAtualizada = valorDistanciaAtualizado + valorPesoAtualizado + acrescimoAtualizado + taxaExtraAtualizada;

      let descontoAtualizado = 0;
      if (valorFinalAtualizada > 500) {
        descontoAtualizado = valorFinalAtualizada * 0.1;
        valorFinalAtualizada = valorFinalAtualizada - descontoAtualizado;
      }

      await pedidosModel.atualizarPedido(
        idPedido,
        dataPedidoAtualizada,
        distanciaAtualizado,
        idClienteAtualizado,
        pesoCargaAtualizada,
        tipoEntregaAtualizada,
        valorKmAtualizado,
        valorKgAtualizado,
        acrescimoAtualizado,
        descontoAtualizado,
        statusEntregaAtualizado,
        taxaExtraAtualizada,
        valorDistanciaAtualizado,
        valorFinalAtualizada,
        valorPesoAtualizado
      );

      res.status(200).json({ message: "Pedido atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao atualizar pedido." });
    }
  },


  // Deletar um pedido

  // DELETE /pedidos

  /**
   * controlador deleta pedidos do banco de dados
   *
   * @async
   * @function: deletar pedidos
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de pedidos
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os pedidos
   */
 

  deletarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;

      if (idPedido.length != 36) {
        return res.status(400).json({ erro: "Id do pedido inválido!" });
      }

      await pedidosModel.deletarPedido(idPedido);
      res.status(200).json({ message: "Pedido excluído com sucesso!" }); // quando o pedido é deletado, automaticamenta a entrega vinculada a ele tambem sera
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      res.status(500).json({ erro: "Erro no servidor ao excluir pedido." });
    }
  },
};

module.exports = { pedidosController };
