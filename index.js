require('dotenv').config();
const debug = require('debug')('server');
const { makeApp } = require('./src/app');

(async () => {
  const app = makeApp();
  const port = app.get('port');

  app.listen(port, () => {
    debug(`App is listening on ${port}`);
  });
})();
