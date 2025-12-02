const { clienteModel } = require("../models/clientesModel");
const { pedidosModel } = require("../models/pedidosModel");

const clienteController = {
  // GET /clientes

  /**
   * controlador lista todos os clientes do banco de dados
   *
   * @async
   * @function: listarClientes
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de clientes
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os clientes
   */

  listarClientes: async (req, res) => {
    try {
      const { idCliente } = req.query;

      if (idCliente) {
        const cliente = await clienteModel.buscarUm(idCliente);
        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ erro: "Cliente não encontrado!" });
        }
        return res.status(200).json(cliente);
      }

      const clientes = await clienteModel.buscarTodos();
      res.status(200).json(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      res.status(500).json({ erro: "Erro ao buscar clientes." });
    }
  },

  // POST /clientes
  /**
   * o constrolador cria todos os clientes no banco de dados
 * @async
 * @function:criar clientes
 * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
 * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
 * @returns {@promise<void>} retorna uma resposta json com uma lista de clientes
 * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os clientes
   
 */
  criarCliente: async (req, res) => {
    try {
      const {
        nomeCliente,
        cpfCliente,
        telCliente,
        emailCliente,
        enderecoCliente,
      } = req.body;

      if (
        !nomeCliente ||
        !cpfCliente ||
        !telCliente ||
        !emailCliente ||
        !enderecoCliente
      ) {
        return res
          .status(400)
          .json({ erro: "Campos obrigatórios não preenchidos!" });
      }

      const result = await clienteModel.buscarCpfouEmail(
        cpfCliente,
        emailCliente
      );
      if (result.length > 0) {
        return res.status(409).json({ erro: "CPF ou Email já cadastrado!" });
      }

      await clienteModel.inserirCliente(
        nomeCliente,
        cpfCliente,
        telCliente,
        emailCliente,
        enderecoCliente
      );

      res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" });
    }
  },

  // PUT /clientes/:idCliente
  /**
   * esse comando é responsável por atualizar clientes no banco de dados 
 * @async
 * @function:atualizar clientes
 * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
 * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
 * @returns {@promise<void>} retorna uma resposta json com uma lista de clientes
 * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os clientes
   
 */

  atualizarCliente: async (req, res) => {
    try {
      const { idCliente } = req.params;
      const {
        nomeCliente,
        cpfCliente,
        telCliente,
        emailCliente,
        enderecoCliente,
      } = req.body;

      const cliente = await clienteModel.buscarUm(idCliente);
      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado!" });
      }

      if (cpfCliente || emailCliente) {
        const result = await clienteModel.buscarCpfouEmail(
          cpfCliente,
          emailCliente
        );
        if (result.length > 0) {
          return res.status(409).json({ erro: "CPF ou Email já cadastrado!" });
        }
      }

      const clienteAtual = cliente[0];
      const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
      const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
      const telAtualizado = telCliente ?? clienteAtual.telCliente;
      const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
      const enderecoAtualizado =
        enderecoCliente ?? clienteAtual.enderecoCliente;

      await clienteModel.atualizarCliente(
        idCliente,
        nomeAtualizado,
        cpfAtualizado,
        telAtualizado,
        emailAtualizado,
        enderecoAtualizado
      );

      res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      res.status(500).json({ erro: "Erro no servidor ao atualizar cliente." });
    }
  },

  // DELETE /clientes/:idCliente
  /**
   * esse comando é responsável por deletar clientes no banco de dados 
 * @async
 * @function: deletar clientes
 * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
 * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
 * @returns {@promise<void>} retorna uma resposta json com uma lista de clientes
 * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os clientes
   
 */

  deletarCliente: async (req, res) => {
    try {
      const { idCliente } = req.params;

      const cliente = await clienteModel.buscarUm(idCliente);
      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado!" });
      }

      const clientePedido = await pedidosModel.buscarPorCliente(idCliente);
      if (clientePedido.length > 0) {
        return res
          .status(400)
          .json({
            erro: "Cliente com pedidos vinculados, não pode ser deletado!",
          });
      }

      await clienteModel.deletarCliente(idCliente);
      res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      res.status(500).json({ erro: "Erro no servidor ao deletar cliente!" });
    }
  },
};

module.exports = { clienteController };
