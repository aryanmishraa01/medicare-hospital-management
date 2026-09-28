/**
 * Database Configuration (config/db.js)
 * ------------------------------------------------------------
 * This file establishes a connection pool to the MySQL database
 * using mysql2/promise for easy async/await syntax.
 * 
 * Why Connection Pool?
 * Instead of creating and closing a new connection for every query,
 * a pool maintains reusable connections, making the application
 * faster, stable, and production-ready.
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_management_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup to give beginner-friendly console feedback
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'hospital_management_db'));
    connection.release();
  } catch (error) {
    console.error('⚠️ [Database Notice]: Could not connect to MySQL server.');
    console.error('   Reason: ' + error.message);
    console.error('   👉 Make sure MySQL is running and check DB_PASSWORD in backend/.env');
    console.error('   👉 Don\'t forget to import database.sql into MySQL!');
  }
})();

module.exports = db;
