const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de la conexión PostgreSQL
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nexo_om_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Probar la conexión
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Conexión a la base de datos PostgreSQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
}

// Funciones auxiliares para manejar queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// Exportar el pool y funciones
module.exports = {
  pool,
  query,
  testConnection
};