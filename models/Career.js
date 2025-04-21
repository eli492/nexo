const { query } = require('../config/db');

class Career {
  // Obtener todas las carreras
  static async findAll() {
    try {
      const result = await query('SELECT * FROM carreras ORDER BY nombre');
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener carreras: ${error.message}`);
    }
  }
  
  // Obtener una carrera por ID
  static async findById(id) {
    try {
      const result = await query(
        'SELECT * FROM carreras WHERE id = $1', 
        [id]
      );
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener carrera: ${error.message}`);
    }
  }
}

module.exports = Career;