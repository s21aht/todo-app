// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user: process.env.PGUSER || "todo_user",
  password: process.env.PGPASSWORD || "todo_pass",
  database: process.env.PGDATABASE || "todo_db",
});

// helper query
const query = (text, params) => pool.query(text, params);

// Create table if not exists
async function init() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableSQL);
}

module.exports = {
  pool,
  query,
  init,
};
