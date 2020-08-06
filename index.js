require('dotenv').config();
const debug = require('debug')('app:server');
const Sentry = require('@sentry/node');
const { makeApp } = require('./src/app');

const { NODE_ENV, SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NODE_ENV || 'development',
});

(async () => {
  const app = makeApp();
  const port = app.get('port');

  app.listen(port, () => {
    debug(`App is listening on ${port}`);
  });
})();
