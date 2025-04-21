const { query } = require('../config/db');

class Resource {
  // Crear un nuevo recurso
  static async create(resourceData) {
    const { titulo, descripcion, tipo, url, archivo, usuario_id, materia_id } = resourceData;
    
    try {
      const result = await query(
        'INSERT INTO recursos (titulo, descripcion, tipo, url, archivo, usuario_id, materia_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [titulo, descripcion, tipo, url, archivo, usuario_id, materia_id]
      );
      
      return { id: result.rows[0].id, ...resourceData };
    } catch (error) {
      throw new Error(`Error al crear recurso: ${error.message}`);
    }
  }
  
  // Obtener un recurso por ID
  static async findById(id) {
    try {
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre, m.carrera_id as carrera_id
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.id = $1`,
        [id]
      );
      
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener recurso: ${error.message}`);
    }
  }
  
  // Obtener todos los recursos
  static async findAll() {
    try {
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         ORDER BY r.fecha_creacion DESC`
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos: ${error.message}`);
    }
  }
  
  // Obtener recursos por materia
  static async findBySubject(materiaId) {
    try {
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.materia_id = $1
         ORDER BY r.fecha_creacion DESC`,
        [materiaId]
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por materia: ${error.message}`);
    }
  }
  
  // Obtener recursos por carrera
  static async findByCareer(carreraId) {
    try {
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE m.carrera_id = $1
         ORDER BY r.fecha_creacion DESC`,
        [carreraId]
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por carrera: ${error.message}`);
    }
  }
  
  // Obtener recursos por usuario
  static async findByUser(userId) {
    try {
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.usuario_id = $1
         ORDER BY r.fecha_creacion DESC`,
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener recursos por usuario: ${error.message}`);
    }
  }
  
  // Actualizar un recurso
  static async update(id, resourceData) {
    const { titulo, descripcion, materia_id } = resourceData;
    
    try {
      const result = await query(
        'UPDATE recursos SET titulo = $1, descripcion = $2, materia_id = $3 WHERE id = $4',
        [titulo, descripcion, materia_id, id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Error al actualizar recurso: ${error.message}`);
    }
  }
  
  // Eliminar un recurso
  static async delete(id) {
    try {
      const result = await query(
        'DELETE FROM recursos WHERE id = $1',
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Error al eliminar recurso: ${error.message}`);
    }
  }
  
  // Buscar recursos
  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      
      const result = await query(
        `SELECT r.*, u.nombre as usuario_nombre, m.nombre as materia_nombre, c.nombre as carrera_nombre
         FROM recursos r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN materias m ON r.materia_id = m.id
         JOIN carreras c ON m.carrera_id = c.id
         WHERE r.titulo ILIKE $1 OR r.descripcion ILIKE $2
         ORDER BY r.fecha_creacion DESC`,
        [searchTerm, searchTerm]
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al buscar recursos: ${error.message}`);
    }
  }
}

module.exports = Resource;