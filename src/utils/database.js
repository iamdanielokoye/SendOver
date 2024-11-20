const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,         // e.g., 'postgres'
  host: process.env.PG_HOST,         // e.g., 'localhost' or a cloud-hosted service
  database: process.env.PG_DATABASE, // e.g., 'sendoverdb'
  password: process.env.PG_PASSWORD, // Your database password
  port: process.env.PG_PORT,         // Default is 5432
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('PostgreSQL database connection error:', err);
});

module.exports = { pool };
