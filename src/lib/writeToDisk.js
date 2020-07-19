const fs = require('fs');
const { PassThrough } = require('stream');

const writeToDisk = (filepath) => {
  const pass = PassThrough();

  const write = fs.createWriteStream(filepath);

  const promise = new Promise((resolve, reject) => {
    write.on('finish', resolve);
    write.on('error', reject);
  });

  pass.pipe(write);
  return { writeStream: pass, promise };
};

module.exports = { writeToDisk };
