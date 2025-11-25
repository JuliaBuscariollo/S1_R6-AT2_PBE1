const { sql, getConnection } = require("../config/db");

const entregasModel = {
  
  //listar todas as entregas
  listarEntregas: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT e.*, p.idCliente, p.tipoEntrega, p.distancia, p.pesoCarga 
      FROM entregas e
      INNER JOIN pedidos p ON p.idPedido = e.idPedido
    `);
    return result.recordset;
  },

  // buscar entrega por ID
  buscarUm: async (idEntrega) => {
    // console.log(` Pedido: ${idPedido}`);
    const pool = await getConnection();
    const result = await pool.request()
      .input("idEntrega", sql.UniqueIdentifier, idEntrega)
      .query(`
        SELECT *
        FROM Entregas 
        WHERE idEntrega = @idEntrega
      `);

    console.log(result);

    return result.recordset[0];
  },
};

module.exports = { entregasModel };
