const { sql, getConnection } = require("../config/db");

const clienteModel = {
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

  buscarCpf: async (cpfCliente) => {
    try {
      const pool = await getConnection();
      const query = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente;";
      const result = await pool
        .request()
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .query(query);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar cliente por CPF:", error);
      throw error;
    }
  },

  buscarUm: async (idCliente) => {
    try {
      const pool = await getConnection();
      const query = "SELECT * FROM Clientes WHERE idCliente = @idCliente";
      const result = await pool
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente) // troque para UniqueIdentifier se for o caso
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar o cliente:", error);
      throw error;
    }
  },

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
