const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard del usuario
router.get('/dashboard', isAuthenticated, userController.getDashboard);

// Perfil del usuario
router.get('/profile', isAuthenticated, userController.getProfile);

// Actualizar perfil
router.post(
  '/profile',
  isAuthenticated,
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Ingresa un correo electrónico válido').isEmail()
  ],
  userController.updateProfile
);

// Cambio de contraseña
router.get('/change-password', isAuthenticated, userController.getChangePassword);

// Procesar cambio de contraseña
router.post(
  '/change-password',
  isAuthenticated,
  [
    check('currentPassword', 'La contraseña actual es obligatoria').notEmpty(),
    check('newPassword', 'La nueva contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
  ],
  userController.postChangePassword
);

module.exports = router;