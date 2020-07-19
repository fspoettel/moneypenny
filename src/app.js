const path = require('path');
const fs = require('fs');
const express = require('express');
const nunjucks = require('nunjucks');
const postTranscribe = require('./controllers/postTranscribe');
const getIndex = require('./controllers/getIndex');
const helmet = require('helmet');
const { asyncHandler } = require('./lib/helpers');
const { gcsUploadStream } = require('./lib/googleCloud');
const { flacEncoder } = require('./lib/ffmpeg');

const { PORT } = process.env;

function makeApp() {
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

  app.post('/transcribe-now', asyncHandler(async (req, res) => {
    const { writeStream, promise } = gcsUploadStream(`cdn2.flac`);
    flacEncoder(fs.createReadStream(path.join(process.cwd(), 'cdn.mp3')))
      .pipe(writeStream);

    await promise;
    res.send('OK');
  }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message });
  });

  return app;
}

module.exports = { makeApp };
