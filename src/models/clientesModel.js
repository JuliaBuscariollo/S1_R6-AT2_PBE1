const { sql, getConnection } = require("../config/db");

// buscar todos os clientes no banco de dados
const clienteModel = {
    /**
     * GET/Clientes
   * ela busca todos os clientes no banco de dados
   *
   * @async
   * @function burscarTodos
   * @returns {Promise<array>} retorna uma lista com todos os clientes
   * @throws mostra no console e propaga o erro caso a busca falhe
   */

  buscarTodos: async () => {
    try {
      const pool = await getConnection();
      const query = "SELECT * FROM Clientes;";
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  },

  /**
     * GET/Clientes
   * ela busca um cliente no banco de dados a partir do id
   *    
   * @async
   * @function burscarTodos
   * @returns {Promise<array>} retorna uma lista com o cliente
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
  buscarUm: async (idCliente) => {
    // console.log(` Pedido: ${idPedido}`);
    
    try {
      
      const pool = await getConnection();
      const result = await pool.request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .query(`
          SELECT *
          FROM Clientes 
          WHERE idCliente = @idCliente
        `);

        return result.recordset;

    } catch (error) {
        console.error("Erro ao buscar cliente!", error);
      throw error;
    }
  },

//buscar um cpf no banco de dados
/**
     * GET/Clientes
   * ela busca todos os dados como cpf e email no banco de dados 
   *
   * @async
   * @function burscarTodos
   * @returns {Promise<array>} retorna os cfps e emails já cadastrados
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
  buscarCpfouEmail: async (cpfCliente, emailCliente) => {
    try {
      const pool = await getConnection();
      const query = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente OR emailCliente = @emailCliente;";
      const result = await pool
        .request()
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .input("emailCliente", sql.VarChar(150), emailCliente)
        .query(query);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar cliente por cpf ou email:", error);
      throw error;
    }
  },
 

  //inserir o cliente no banco de dados

  /**
     * POST /Clientes
   * ela insere o cliente no banco de dados
   *
   * @async
   * @function inserirCliente
   * @returns {Promise<array>} retorna uma mensagem de criação bem sucedida
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
  inserirCliente: async (
    nomeCliente,
    cpfCliente,
    telCliente,
    emailCliente,
    enderecoCliente
  ) => {
    try {
      const pool = await getConnection();
      const query = `
        INSERT INTO Clientes (nomeCliente, cpfCliente, telCliente, emailCliente, enderecoCliente)
        VALUES (@nomeCliente, @cpfCliente, @telCliente, @emailCliente, @enderecoCliente)
      `;
      await pool
        .request()
        .input("nomeCliente", sql.VarChar(100), nomeCliente)
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .input("telCliente", sql.Char(15), telCliente)
        .input("emailCliente", sql.VarChar(150), emailCliente)
        .input("enderecoCliente", sql.VarChar(150), enderecoCliente)
        .query(query);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  },


  // atualizar o cliente no banco de dados
  /**
     * PUT/Clientes
   * ela atualiza o cliente no banco de dados
   *
   * @async
   * @function atualizarCliente
   * @returns {Promise<array>} retorna uma mensagem de atualização bem sucedida 
   * @throws mostra no console e propaga o erro caso a busca falhe
   */
  atualizarCliente: async (
    idCliente,
    nomeCliente,
    cpfCliente,
    telCliente,
    emailCliente,
    enderecoCliente
  ) => {
    try {
      const pool = await getConnection();
      const query = `
        UPDATE Clientes
        SET nomeCliente = @nomeCliente,
            cpfCliente = @cpfCliente,
            telCliente = @telCliente,
            emailCliente = @emailCliente,
            enderecoCliente = @enderecoCliente
        WHERE idCliente = @idCliente
      `;
      await pool
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .input("nomeCliente", sql.VarChar(100), nomeCliente)
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .input("telCliente", sql.Char(15), telCliente)
        .input("emailCliente", sql.VarChar(150), emailCliente)
        .input("enderecoCliente", sql.VarChar(150), enderecoCliente)
        .query(query);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },

  // deletar o cliente no banco de dados
   /**
     * DELETE /Clientes
   * ela deleta o cliente no banco de dados
   *
   * @async
   * @function deletarCliente
   * @returns {Promise<array>} retorna uma mensagem de exclusão bem sucedida 
   * @throws mostra no console e propaga o erro caso a busca falhe
   */

  deletarCliente: async (idCliente) => {
    try {
      const pool = await getConnection();
      const query = "DELETE FROM Clientes WHERE idCliente = @idCliente";
      await pool.request().input("idCliente", sql.UniqueIdentifier, idCliente).query(query);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },
};

module.exports = { clienteModel };
