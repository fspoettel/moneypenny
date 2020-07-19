require('dotenv').config();
const { makeApp } = require('./src/app');

const debug = require('debug')('app:server');

(async () => {
  const app = makeApp();
  const port = app.get('port');

  app.listen(port, () => {
    debug(`App is listening on ${port}`);
  });
})();
