const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Crear un nuevo usuario
  static async create(userData) {
    const { nombre, email, password } = userData;
    
    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insertar usuario en la base de datos
      const [result] = await pool.execute(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword]
      );
      
      return { id: result.insertId, nombre, email };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }
  
  // Buscar usuario por email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }
  
  // Buscar usuario por ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nombre, email, fecha_reg FROM usuarios WHERE id = ?',
        [id]
      );
      
      return rows.length ? rows[0] : null;
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
      const [rows] = await pool.execute(
        'SELECT id, nombre, email, fecha_reg FROM usuarios'
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }
  
  // Actualizar usuario
  static async update(id, userData) {
    const { nombre, email } = userData;
    
    try {
      const [result] = await pool.execute(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }
  
  // Actualizar contraseña
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const [result] = await pool.execute(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }
}

module.exports = User;