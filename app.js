// Importación de módulos
const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const multer = require('multer');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const userRoutes = require('./routes/users');

// Inicializar app
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'nexoom-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware global para pasar datos de usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// Ruta para la página principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'NexoO&M - Plataforma Colaborativa de Recursos Educativos'
  });
});

// Middleware para manejo de errores 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    message: 'La página que buscas no existe.'
  });
});

// Middleware global para manejar mensajes
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMessage = req.session.successMessage || null;
    req.session.successMessage = null; // Limpiar mensaje después de usarlo
    next();
  });


// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err);
    
    // Manejar error de Multer por archivo demasiado grande
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      req.fileValidationError = 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.';
      return res.status(400).render('resources/create', {
        title: 'Subir Recurso - NexoO&M',
        careers: req.careers || [],
        subjects: req.subjects || [],
        errors: [{ msg: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.' }],
        formData: req.body || {}
      });
    }
    
    // Para otros errores, mostrar página de error genérica
    res.status(500).render('error', {
      title: 'Error',
      message: 'Ha ocurrido un error en el servidor'
    });
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;