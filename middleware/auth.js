// middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
  console.log("Verificando autenticación:", req.session);
  // Verifica también si la sesión contiene el objeto user
  if (req.session && req.session.user) {
    console.log("Usuario autenticado:", req.session.user);
    return next();
  } else {
    console.log("Usuario no autenticado, redirigiendo a login");
    res.redirect('/login');
  }
};

exports.isNotAuthenticated = (req, res, next) => {
  console.log("Verificando NO autenticación:", req.session);
  // Verifica también si la sesión contiene el objeto user
  if (!req.session || !req.session.user) {
    return next();
  } else {
    console.log("Usuario ya autenticado, redirigiendo a dashboard");
    res.redirect('/users/dashboard');
  }
};