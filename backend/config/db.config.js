// db.config.js
const mysql = require("mysql2/promise");

const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

// Export both pool and query
module.exports = { pool, query: pool.query.bind(pool) };