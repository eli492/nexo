const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const resourceController = require('../controllers/resourceController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Career = require('../models/Career');
const Subject = require('../models/Subject');

// Middleware para obtener datos necesarios para el formulario
const prepareFormData = async (req, res, next) => {
  try {
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    req.careers = careers;
    req.subjects = subjects;
    next();
  } catch (error) {
    next(error);
  }
};

// Listar todos los recursos
router.get('/', resourceController.getAllResources);

// Buscar recursos
router.get('/search', resourceController.searchResources);

// Formulario para crear recurso
router.get('/create', isAuthenticated, resourceController.getCreateResource);

// Procesar creación de recurso
router.post(
  '/create',
  isAuthenticated,
  prepareFormData, // Este middleware se ejecuta primero
  upload.single('archivo'), // Luego se procesa el archivo
  [
    check('titulo', 'El título es obligatorio').notEmpty(),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('tipo', 'El tipo de recurso es obligatorio').isIn(['enlace', 'archivo']),
    check('materia_id', 'Debes seleccionar una materia').notEmpty(),
    check('url').custom((value, { req }) => {
      if (req.body.tipo === 'enlace' && !value) {
        throw new Error('El enlace es obligatorio para recursos tipo enlace');
      }
      if (req.body.tipo === 'enlace' && !/^https?:\/\/.+/.test(value)) {
        throw new Error('Ingresa una URL válida (debe comenzar con http:// o https://)');
      }
      return true;
    }),
    check('archivo').custom((value, { req }) => {
      if (req.body.tipo === 'archivo' && !req.file && !req.fileValidationError) {
        throw new Error('El archivo es obligatorio para recursos tipo archivo');
      }
      return true;
    })
  ],
  resourceController.postCreateResource
);

// Ver recursos por materia
router.get('/subject/:id', resourceController.getResourcesBySubject);

// Ver recursos por carrera
router.get('/career/:id', resourceController.getResourcesByCareer);

// Ver detalles de un recurso
router.get('/:id', resourceController.getResourceDetails);

// Formulario para editar recurso
router.get('/:id/edit', isAuthenticated, resourceController.getEditResource);

// Procesar actualización de recurso
router.post(
  '/:id/edit',
  isAuthenticated,
  [
    check('titulo', 'El título es obligatorio').notEmpty(),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('materia_id', 'Debes seleccionar una materia').notEmpty()
  ],
  resourceController.postUpdateResource
);

// Eliminar recurso
router.delete('/:id', isAuthenticated, resourceController.deleteResource);

module.exports = router;