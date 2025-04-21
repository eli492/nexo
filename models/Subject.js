const { query } = require('../config/db');

class Subject {
  // Obtener todas las materias
  static async findAll() {
    try {
      const result = await query(
        `SELECT m.*, c.nombre as carrera_nombre 
         FROM materias m 
         JOIN carreras c ON m.carrera_id = c.id 
         ORDER BY c.nombre, m.nombre`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener materias: ${error.message}`);
    }
  }
  
  // Obtener materias por carrera
  static async findByCareer(carreraId) {
    try {
      const result = await query(
        `SELECT m.*, c.nombre as carrera_nombre 
         FROM materias m 
         JOIN carreras c ON m.carrera_id = c.id 
         WHERE m.carrera_id = $1 
         ORDER BY m.nombre`,
        [carreraId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener materias por carrera: ${error.message}`);
    }
  }
  
  // Obtener una materia por ID
  static async findById(id) {
    try {
      const result = await query(
        `SELECT m.*, c.nombre as carrera_nombre 
         FROM materias m 
         JOIN carreras c ON m.carrera_id = c.id 
         WHERE m.id = $1`,
        [id]
      );
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener materia: ${error.message}`);
    }
  }
}

module.exports = Subject;