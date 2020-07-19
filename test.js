const fs = require('fs');
require('dotenv').config();
const path = require('path');
const { gcsUploadStream } = require('./src/lib/googleCloud');
const { flacEncoder } = require('./src/lib/ffmpeg');

(async () => {
  const { writeStream, promise } = gcsUploadStream(`cdn.flac`);
  flacEncoder(fs.createReadStream(path.join(process.cwd(), 'cdn.mp3')))
    .pipe(writeStream);

  await promise;
})();
