const { pool } = require('../config/db');

class Resource {
  // Crear un nuevo recurso
  static async create(resourceData) {
    const { titulo, descripcion, tipo, url, archivo, usuario_id, materia_id } = resourceData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO recursos (titulo, descripcion, tipo, url, archivo, usuario_id, materia_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [titulo, descripcion, tipo, url, archivo, usuario_id, materia_id]
      );
      
      return { id: result.insertId, ...resourceData };
    } catch (error) {
      throw new Error(`Error al crear recurso: ${error.message}`);
    }
  }
  
  // Obtener un recurso por ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.id = ?`,
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener recurso: ${error.message}`);
    }
  }
  
  // Obtener todos los recursos
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         ORDER BY r.fecha_creacion DESC`
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos: ${error.message}`);
    }
  }
  
  // Obtener recursos por materia
  static async findBySubject(materiaId) {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.materia_id = ?
         ORDER BY r.fecha_creacion DESC`,
        [materiaId]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por materia: ${error.message}`);
    }
  }
  
  // Obtener recursos por carrera
  static async findByCareer(carreraId) {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE m.carrera_id = ?
         ORDER BY r.fecha_creacion DESC`,
        [carreraId]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por carrera: ${error.message}`);
    }
  }
  
  // Obtener recursos por usuario
  static async findByUser(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.usuario_id = ?
         ORDER BY r.fecha_creacion DESC`,
        [userId]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por usuario: ${error.message}`);
    }
  }
  
  // Actualizar un recurso
  static async update(id, resourceData) {
    const { titulo, descripcion, materia_id } = resourceData;
    
    try {
      const [result] = await pool.execute(
        'UPDATE recursos SET titulo = ?, descripcion = ?, materia_id = ? WHERE id = ?',
        [titulo, descripcion, materia_id, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar recurso: ${error.message}`);
    }
  }
  
  // Eliminar un recurso
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM recursos WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al eliminar recurso: ${error.message}`);
    }
  }
  
  // Buscar recursos
  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      
      const [rows] = await pool.execute(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.titulo LIKE ? OR r.descripcion LIKE ?
         ORDER BY r.fecha_creacion DESC`,
        [searchTerm, searchTerm]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al buscar recursos: ${error.message}`);
    }
  }
}

module.exports = Resource;