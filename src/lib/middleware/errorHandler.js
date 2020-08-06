const debug = require('debug')('app:server')
const Sentry = require('@sentry/node')

const { ValidationError, LimitError, UnauthenticatedError } = require('../../constants')

// eslint-disable-next-line no-unused-vars
function errorHandler (err, req, res, next) {
  debug(err.stack)

  let status = 500

  if (err instanceof ValidationError) {
    status = 400
  } else if (err instanceof LimitError) {
    status = 413
  } else if (err instanceof UnauthenticatedError) {
    status = 401
  } else {
    Sentry.captureException(err)
  }

  res.status(status)
  res.json(status === 500
    ? { message: 'Internal server error' }
    : { message: err.message }
  )
}

module.exports = errorHandler
