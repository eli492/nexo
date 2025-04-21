// models/Career.js
const { pool } = require('../config/db');

class Career {
  // Obtener todas las carreras
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM carreras ORDER BY nombre');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener carreras: ${error.message}`);
    }
  }
  
  // Obtener una carrera por ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM carreras WHERE id = ?', 
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener carrera: ${error.message}`);
    }
  }
}

module.exports = Career;