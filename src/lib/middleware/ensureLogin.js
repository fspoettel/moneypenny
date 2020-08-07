const { UnauthenticatedError } = require('../../constants')

function ensureLogin (req, res, next) {
  if (req.isAuthenticated()) return next()
  return res.redirect('/login')
}

function ensureLoginApi (req, res, next) {
  if (req.isAuthenticated()) return next()
  return next(new UnauthenticatedError('Not Logged In'))
}

module.exports = {
  ensureLogin,
  ensureLoginApi
}
