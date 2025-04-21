const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

// Rutas de registro
router.get('/register', isNotAuthenticated, authController.getRegister);
router.post(
  '/register',
  isNotAuthenticated,
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Ingresa un correo electrónico válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
  ],
  authController.postRegister
);

// Rutas de login
router.get('/login', isNotAuthenticated, authController.getLogin);
router.post(
  '/login',
  isNotAuthenticated,
  [
    check('email', 'Ingresa un correo electrónico válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty()
  ],
  authController.postLogin
);

// Ruta de logout
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;