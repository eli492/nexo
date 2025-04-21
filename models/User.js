const { query } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Crear un nuevo usuario
  static async create(userData) {
    const { nombre, email, password } = userData;
    
    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insertar usuario en la base de datos y retornar el ID generado
      const result = await query(
        'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id',
        [nombre, email, hashedPassword]
      );
      
      return { id: result.rows[0].id, nombre, email };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }
  
  // Buscar usuario por email
  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }
  
  // Buscar usuario por ID
  static async findById(id) {
    try {
      const result = await query(
        'SELECT id, nombre, email, fecha_reg FROM usuarios WHERE id = $1',
        [id]
      );
      
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }
  
  // Validar contraseña
  static async validatePassword(providedPassword, storedPassword) {
    return bcrypt.compare(providedPassword, storedPassword);
  }
  
  // Obtener todos los usuarios
  static async findAll() {
    try {
      const result = await query(
        'SELECT id, nombre, email, fecha_reg FROM usuarios'
      );
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }
  
  // Actualizar usuario
  static async update(id, userData) {
    const { nombre, email } = userData;
    
    try {
      const result = await query(
        'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3',
        [nombre, email, id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }
  
  // Actualizar contraseña
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const result = await query(
        'UPDATE usuarios SET password = $1 WHERE id = $2',
        [hashedPassword, id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }
}

module.exports = User;