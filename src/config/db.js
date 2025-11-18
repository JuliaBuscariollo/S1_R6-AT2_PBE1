const sql = require("mssql");

const config = {
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  server: process.env.SERVER_DB,
  database: "logisticars",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("erro na conexão do SQL server:", error);
  }
}

module.exports = { sql, getConnection };

// (async () => {
//   const teste = await getConnetion();

//   if (teste) {
//     console.log("conexão bem sucedida");
//   }
// })();
