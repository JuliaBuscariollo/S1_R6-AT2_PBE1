const { sql, getConnection } = require("../config/db");

const entregasModel = {
  
  // LISTAR TODAS AS ENTREGAS
  listarEntregas: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT e.*, p.idCliente, p.tipoEntrega, p.distancia, p.pesoCarga 
      FROM entregas e
      INNER JOIN pedidos p ON p.idPedido = e.idPedido
    `);
    return result.recordset;
  },

  // BUSCAR ENTREGA POR ID
  buscarUm: async (idEntrega) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input("idEntrega", sql.Int, idEntrega)
      .query(`
        SELECT e.*, p.idCliente, p.tipoEntrega, p.distancia, p.pesoCarga
        FROM entregas e
        INNER JOIN pedidos p ON p.idPedido = e.idPedido
        WHERE e.idEntrega = @idEntrega
      `);

    return result.recordset[0];
  },
};

module.exports = { entregasModel };
