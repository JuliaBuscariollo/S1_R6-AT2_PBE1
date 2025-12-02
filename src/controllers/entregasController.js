const { entregasModel } = require("../models/entregasModel");

const entregasController = {

  // Listar todas as entregas

   // GET /entregas

  /**
   * controlador lista todas as entregas do banco de dados
   *
   * @async
   * @function: listarEntregas
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de entregas
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os entregas
   */

  listarEntregas: async (req, res) => {
    try {
      const {idEntrega} = req.query;

      if (idEntrega) {
        if(idEntrega.length != 36) {
          return res.status(400).json({erro: `id da entrega invalido!`})
        }

        const entrega = await entregasModel.buscarUm(idEntrega)

        return res.status(200).json(entrega);
      }


      const entregas = await entregasModel.listarEntregas();
      res.status(200).json(entregas);
    } catch (error) {
      console.error("Erro ao listar entregas:", error);
      res.status(500).json({ erro: "Erro no servidor ao listar entregas." });
    }
  },

  // Buscar entrega através do ID
  // GET /entregas

  /**
   * controlador lista uma entrega especifica do banco de dados
   *
   * @async
   * @function: buscar Um
   * @param {object} req -> objeto de requisisão (recebido do cliente HTTP)
   * @param {object} res -> objeto de resposta ( enviado ao  cliente HTTP)
   * @returns {@promise<void>} retorna uma resposta json com uma lista de entregas
   * @throws Mostra o console e retorna erro 500 se ocorrer falha de buscar os entregas
   */

  buscarUm: async (req, res) => {
    try {
      const { idEntrega } = req.params;
      const entrega = await entregasModel.buscarUm(idEntrega);

      if (!entrega) {
        return res.status(404).json({ erro: "Entrega não encontrada." });
      }

      res.status(200).json(entrega);
    } catch (error) {
      console.error("Erro ao buscar entrega:", error);
      res.status(500).json({ erro: "Erro no servidor ao buscar entrega." });
    }
  },
};

module.exports = { entregasController };
