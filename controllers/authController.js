const { validationResult } = require('express-validator');
const User = require('../models/User');

// Renderizar formulario de registro
exports.getRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Registro de Usuario - NexoO&M',
    errors: []
  });
};

// Procesar registro de usuario
exports.postRegister = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Registro de Usuario - NexoO&M',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Verificar si el correo ya existe
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Registro de Usuario - NexoO&M',
        errors: [{ msg: 'El correo electrónico ya está registrado' }],
        formData: req.body
      });
    }

    // Crear el usuario
    const user = await User.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password
    });

    // Iniciar sesión automáticamente
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email
    };
    
    // Redireccionar a dashboard
    res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error en registro:', error);
    res.render('auth/register', {
      title: 'Registro de Usuario - NexoO&M',
      errors: [{ msg: 'Error al registrar usuario, inténtalo de nuevo' }],
      formData: req.body
    });
  }
};

// Renderizar formulario de login
exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión - NexoO&M',
    errors: []
  });
};

// Procesar login de usuario
exports.postLogin = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión - NexoO&M',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Buscar usuario por email
    const user = await User.findByEmail(req.body.email);
    
    console.log("Usuario encontrado:", user); // Añadir para depuración
    
    if (!user) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión - NexoO&M',
        errors: [{ msg: 'Credenciales inválidas' }],
        formData: req.body
      });
    }

    // Verificar contraseña
    const isMatch = await User.validatePassword(req.body.password, user.password);
    
    console.log("Contraseña válida:", isMatch); // Añadir para depuración
    
    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión - NexoO&M',
        errors: [{ msg: 'Credenciales inválidas' }],
        formData: req.body
      });
    }

    // Guardar usuario en sesión
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email
    };
    
    console.log("Sesión guardada:", req.session.user); // Añadir para depuración

    // Redireccionar a dashboard
    console.log("Redirigiendo a dashboard"); // Añadir para depuración
    return res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error en login:', error);
    res.render('auth/login', {
      title: 'Iniciar Sesión - NexoO&M',
      errors: [{ msg: 'Error al iniciar sesión, inténtalo de nuevo' }],
      formData: req.body
    });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};