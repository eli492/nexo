const { validationResult } = require('express-validator');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Career = require('../models/Career');
const Subject = require('../models/Subject');

// Mostrar dashboard del usuario
exports.getDashboard = async (req, res) => {
    try {
      // Obtener recursos del usuario
      const userResources = await Resource.findByUser(req.session.user.id);
      
      // Obtener carreras y materias
      const careers = await Career.findAll();
      const subjects = await Subject.findAll();
      
      res.render('users/dashboard', {
        title: 'Mi Panel - NexoO&M',
        userResources,
        careers,
        subjects
      });
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el panel de usuario'
      });
    }
  };

// Mostrar formulario de perfil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    
    res.render('users/profile', {
      title: 'Mi Perfil - NexoO&M',
      user,
      errors: []
    });
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el perfil de usuario'
    });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/profile', {
        title: 'Mi Perfil - NexoO&M',
        user: req.body,
        errors: errors.array()
      });
    }
  
    try {
      const { nombre, email } = req.body;
      
      // Verificar si el email ya está en uso por otro usuario
      if (email !== req.session.user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== req.session.user.id) {
          return res.render('users/profile', {
            title: 'Mi Perfil - NexoO&M',
            user: req.body,
            errors: [{ msg: 'Este correo electrónico ya está en uso por otro usuario' }]
          });
        }
      }
      
      // Actualizar usuario
      await User.update(req.session.user.id, { nombre, email });
      
      // Actualizar datos de sesión
      req.session.user.nombre = nombre;
      req.session.user.email = email;
      
      // Cargar el usuario actualizado
      const updatedUser = await User.findById(req.session.user.id);
      
      // Renderizar la página con mensaje de éxito
      return res.render('users/profile', {
        title: 'Mi Perfil - NexoO&M',
        user: updatedUser,
        errors: [],
        successMessage: 'Perfil actualizado correctamente'
      });
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.render('users/profile', {
        title: 'Mi Perfil - NexoO&M',
        user: req.body,
        errors: [{ msg: 'Error al actualizar el perfil, inténtalo de nuevo' }]
      });
    }
  };

// Mostrar formulario de cambio de contraseña
exports.getChangePassword = (req, res) => {
  res.render('users/change-password', {
    title: 'Cambiar Contraseña - NexoO&M',
    errors: []
  });
};

// Procesar cambio de contraseña
exports.postChangePassword = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('users/change-password', {
      title: 'Cambiar Contraseña - NexoO&M',
      errors: errors.array()
    });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    
    // En lugar de usar pool directamente, usamos el modelo User
    // para obtener el usuario completo con contraseña
    const user = await User.findByEmail(req.session.user.email);
    
    if (!user) {
      return res.render('users/change-password', {
        title: 'Cambiar Contraseña - NexoO&M',
        errors: [{ msg: 'Usuario no encontrado' }]
      });
    }
    
    // Verificar contraseña actual
    const isMatch = await User.validatePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.render('users/change-password', {
        title: 'Cambiar Contraseña - NexoO&M',
        errors: [{ msg: 'La contraseña actual es incorrecta' }]
      });
    }
    
    // Actualizar contraseña
    await User.updatePassword(req.session.user.id, newPassword);
    
    // Redireccionar con mensaje de éxito
    req.session.successMessage = 'Contraseña actualizada correctamente';
    res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.render('users/change-password', {
      title: 'Cambiar Contraseña - NexoO&M',
      errors: [{ msg: 'Error al cambiar la contraseña, inténtalo de nuevo' }]
    });
  }
};