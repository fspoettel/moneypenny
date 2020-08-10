const fs = require('fs')

const debug = require('debug')('app:disk')

const removeTempFile = (path) => {
  debug(`Removing file: ${path}`)
  return fs.promises.unlink(path)
    .then(() => { debug(`Removed file: ${path}`) })
    .catch((err) => { debug(err) })
}

const writeTempFile = (filepath) => {
  const write = fs.createWriteStream(filepath)

  const promise = new Promise((resolve, reject) => {
    write.on('finish', () => {
      debug(`Ended write for ${filepath}`)
      return resolve()
    })

    write.on('error', (err) => {
      debug(`Write error: ${filepath}`, err)
      return reject(err)
    })
  })

  debug(`Writing upload to disk: ${filepath}`)
  return { writeStream: write, promise }
}

module.exports = { removeTempFile, writeTempFile }
