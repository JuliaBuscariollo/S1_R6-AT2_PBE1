const { sql, getConnection } = require("../config/db");

const pedidosModel = {
  
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
  listarPedidos: async () => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM pedidos");
    return result.recordset;
  },

  criarPedido: async (
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
  ) => {
    const pool = await getConnection();

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      let querySQL = `INSERT INTO Pedidos ( idCliente, dataPedido, distancia, pesoCarga, tipoEntrega, valorKg, valorKm)
    OUTPUT INSERTED.idPedido
    VALUES (@idCliente, @dataPedido, @distancia, @pesoCarga, @tipoEntrega, @valorKg, @valorKm)`;

      const result = await transaction
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .input("dataPedido", sql.Date, dataPedido)
        .input("distancia", sql.Decimal(10, 2), distancia)
        .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
        .input("tipoEntrega", sql.VarChar(15), tipoEntrega)
        .input("valorKg", sql.Decimal(10, 2), valorKg)
        .input("valorKm", sql.Decimal(10, 2), valorKm)
        .query(querySQL);

      const idPedido = result.recordset[0].idPedido;

      querySQL = `INSERT INTO Entregas (idPedido, acrescimo, desconto, statusEntrega, taxaExtra, valorDistancia, valorFinal, valorPeso)
      VALUES (@idPedido, @acrescimo, @desconto, @statusEntrega, @taxaExtra, @valorDistancia, @valorFinal, @valorPeso)`;

      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .input("acrescimo", sql.Decimal(10, 2), acrescimo)
        .input("desconto", sql.Decimal(10, 2), desconto)
        .input("statusEntrega", sql.VarChar(20), statusEntrega)
        .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
        .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
        .input("valorFinal", sql.Decimal(10, 2), valorFinal)
        .input("valorPeso", sql.Decimal(10, 2), valorPeso)
        .query(querySQL);

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      console.error(`Erro ao inserir pedido:`, error);
      throw error;
    }
  },

   
  // Buscar um pedido por ID
  
  buscarUm: async (idPedido) => {
    /**
     * GET/ pedidos
   * ela busca um pedido no banco de dados a partir do id
   *    
   * @async
   * @function burscarTodos
   * @returns {Promise<array>} retorna uma lista com o pedido
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
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

  buscarPorCliente: async(idCliente) =>{
     /**
     * GET/ pedidos
   * ela busca um pedido no banco de dados a partir do idCliente
   *    
   * @async
   * @function burscarPorCliente
   * @returns {Promise<array>} retorna uma lista com o pedido
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
    const pool = await getConnection();

      try {
        const pool = await getConnection();
        const querySQL = `SELECT * FROM PEDIDOS WHERE idCliente = @idCliente`;
  
        const result = await pool
          .request()
          .input("idCliente", sql.UniqueIdentifier, idCliente)
          .query(querySQL);
  

        return result.recordset;
      } catch (error) {
        console.error(`Erro ao buscar o pedido sobre esse cliente:`, error);
      throw error;
      }
  },

 
  // atualizar um pedido existente
   /**
     * PUT/pedidos/:idPedido
   * ela atualiza o pedido no banco de dados
   *
   * @async
   * @function atualizarPedido
   * @returns {Promise<array>} retorna uma mensagem de atualização bem sucedida 
   * @throws mostra no console e propaga o erro caso a busca falhe
   */

  atualizarPedido: async (

    idPedido,
    dataPedido,
    distancia,
    idCliente,
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
  ) => {
    const pool = await getConnection();

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      let querySQL = `UPDATE Pedidos 
      SET idCliente= @idCliente,
        dataPedido = @dataPedido,
        distancia = @distancia, 
        pesoCarga = @pesoCarga,
        tipoEntrega = @tipoEntrega,
        valorKg = @valorKg, 
        valorKm = @valorKm
      WHERE idPedido = @idPedido`;

      await transaction
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .input("dataPedido", sql.Date, dataPedido)
        .input("distancia", sql.Decimal(10, 2), distancia)
        .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
        .input("tipoEntrega", sql.VarChar(15), tipoEntrega)
        .input("valorKg", sql.Decimal(10, 2), valorKg)
        .input("valorKm", sql.Decimal(10, 2), valorKm)
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      querySQL = `UPDATE Entregas 
        SET acrescimo = @acrescimo,
            desconto = @desconto,
            statusEntrega = @statusEntrega,
            taxaExtra = @taxaExtra,
            valorDistancia = @valorDistancia,
            valorFinal = @valorFinal,
            valorPeso = @valorPeso
          WHERE  idPedido = @idPedido `;

      await transaction
        .request()
        .input("acrescimo", sql.Decimal(10, 2), acrescimo)
        .input("desconto", sql.Decimal(10, 2), desconto)
        .input("statusEntrega", sql.VarChar(20), statusEntrega)
        .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
        .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
        .input("valorFinal", sql.Decimal(10, 2), valorFinal)
        .input("valorPeso", sql.Decimal(10, 2), valorPeso)
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      console.error(`Erro ao atualizar pedido:`, error);
      throw error;
    }
  },

  // deletar um pedido
    /**
     * DELETE /pedido
   * ela deleta o pedido no banco de dados
   *
   * @async
   * @function deletarPedido
   * @param {string} idPedido - Id do pedido para exclusão. 
   * @returns {Promise<void>} Não retorna nada, apenas executa a exclusão.
   * @throws mostra no console e propaga o erro caso a busca falhe
   */

  deletarPedido: async (idPedido) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(`DELETE FROM ENTREGAS WHERE idPedido = @idPedido`);

      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(`DELETE FROM PEDIDOS WHERE idPedido = @idPedido`);

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      console.error(`Erro ao deletar o pedido:`, error);
      throw error;
    }
  },
};

module.exports = { pedidosModel };
