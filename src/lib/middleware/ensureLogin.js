const { UnauthenticatedError } = require("../../constants");

function ensureLogin(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect('/login');
  }
}

function ensureLoginApi(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      return next(new UnauthenticatedError('Not Logged In'));
  }
}

module.exports = {
  ensureLogin,
  ensureLoginApi
};
