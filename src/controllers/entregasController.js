const { entregasModel } = require("../models/entregasModel");

const entregasController = {

  // Listar todas as entregas
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
