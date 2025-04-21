// middleware/auth.js
// Middleware para verificar si el usuario está autenticado
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    
    res.redirect('/login');
  };
  
  // Middleware para verificar si el usuario NO está autenticado
  exports.isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    
    res.redirect('/users/dashboard');
  };