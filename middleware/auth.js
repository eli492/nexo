// middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
  console.log("Verificando autenticación:", req.session); // Añadir para depuración
  if (req.session.user) {
    return next();
  }
  
  res.redirect('/login');
};

exports.isNotAuthenticated = (req, res, next) => {
  console.log("Verificando NO autenticación:", req.session); // Añadir para depuración
  if (!req.session.user) {
    return next();
  }
  
  res.redirect('/users/dashboard');
};