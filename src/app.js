const path = require('path');
const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const Sentry = require('@sentry/node');
const postTranscribe = require('./controllers/postTranscribe');
const getIndex = require('./controllers/getIndex');
const { ValidationError, LimitError } = require('./constants');

const { PORT, SENTRY_DSN } = process.env;

const debug = require('debug')('app:server');

function makeApp() {
  Sentry.init({ dsn: SENTRY_DSN });
  const app = express();
  app.set('port', PORT || 3000);
  app.set('etag', false);

  nunjucks.configure('views', {
    autoescape: true,
    express: app,
  });

  app.use(helmet());
  app.use('/static', express.static(path.join(process.cwd(), 'public')));

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  app.get('/', getIndex);
  app.post('/transcribe', postTranscribe);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    debug(err.stack);

    let status = 500;

    if (err instanceof ValidationError) {
      status = 400;
    } else if (err instanceof LimitError) {
      status = 413;
    } else {
      Sentry.captureException(err);
    }

    res.status(status);
    res.json(status === 500
      ? { message: 'Internal server error' }
      : { message: err.message }
    );
  });

  return app;
}

module.exports = { makeApp };
