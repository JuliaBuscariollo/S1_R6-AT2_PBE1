const { sql, getConnection } = require("../config/db");

const pedidosModel = {
  listarPedidos: async () => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM entregas");
    return result.recordset;
  },

  criarPedidos: async (
    valorDistancia,
    valorPeso,
    acrescimo,
    desconto,
    taxaExtra,
    valorFinal,
    statusEntrega
  ) => {
    const pool = await getConnection();
    const result = await pool
      .request()
 
      .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
      .input("valorPeso", sql.Decimal(10, 2), valorPeso)
      .input("acrescimo", sql.Decimal(10, 2), acrescimo)
      .input("desconto", sql.Decimal(10, 2), desconto)
      .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
      .input("valorFinal", sql.Decimal(10, 2), valorFinal)
      .input("statusEntrega", sql.VarChar(20), statusEntrega)
      .query(`INSERT INTO entregas ( valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega)
  OUTPUT INSERTED.idEntrega
  VALUES (@valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega)`);

    return result.recordset[0];
  },

  // ------------------------------
  // BUSCAR UM PEDIDO POR ID
  // ------------------------------
  buscarUm: async (idPedido) => {
    try {
      const pool = await getConnection();
      const querySQL = `SELECT * FROM PEDIDOS WHERE idPedido = @idPedido`;

      const result = await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error(`Erro ao buscar o pedido:`, error);
      throw error;
    }
  },

  // ------------------------------
  // ATUALIZAR UM PEDIDO EXISTENTE
  // ------------------------------
  atualizarPedido: async (
    idPedido,
    tipoEntrega,
    distancia,
    pesoCarga,
    valorKm,
    valorKg
  ) => {
    try {
      const pool = await getConnection();

      await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .input("tipoEntrega", sql.VarChar(20), tipoEntrega)
        .input("distancia", sql.Decimal(10, 2), distancia)
        .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
        .input("valorKm", sql.Decimal(10, 2), valorKm)
        .input("valorKg", sql.Decimal(10, 2), valorKg).query(`
          UPDATE pedidos
          SET tipoEntrega = @tipoEntrega,
              distancia = @distancia,
              pesoCarga = @pesoCarga,
              valorKm = @valorKm,
              valorKg = @valorKg
          WHERE idPedido = @idPedido
        `);

      return { message: "Pedido atualizado com sucesso" };
    } catch (error) {
      console.error(`Erro ao atualizar o pedido:`, error);
      throw error;
    }
  },

  // ------------------------------
  // DELETAR UM PEDIDO
  // ------------------------------
  deletarPedido: async (idPedido) => {
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(`DELETE FROM PEDIDOS WHERE idPedido = @idPedido`);
    } catch (error) {
      console.error(`Erro ao deletar o pedido:`, error);
      throw error;
    }
  },
};

module.exports = { pedidosModel };
