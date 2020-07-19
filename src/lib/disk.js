const fs = require('fs');

const debug = require('debug')('app:disk');

const removeTempFile = (path) => {
  debug(`Removing file: ${path}`)
  fs.promises.unlink(path)
    .then(() => { debug(`Removed file: ${path}`) })
    .catch((err) => {
      console.error(err);
    });
};

const writeTempFile = (filepath) => {
  const write = fs.createWriteStream(filepath);

  const promise = new Promise((resolve, reject) => {
    write.on('end',() => {
      debug(`Ended write for ${filepath}`);
      return resolve();
    });

    write.on('close', () => {
      debug(`Closed write for ${filepath}`);
      return resolve();
    });

    write.on('error', (err) => {
      debug(`Write error: ${filepath}`, err);
      return reject(err);
    });
  });

  debug(`Writing upload to disk: ${filepath}`);
  return { writeStream: write, promise };
};

module.exports = { removeTempFile, writeTempFile };
