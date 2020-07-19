const ffmpeg = require('fluent-ffmpeg');

function flacEncoder(inputStream) {
  return ffmpeg()
    .input(inputStream)
    .noVideo()
    .audioChannels(1)
    .format('flac')
    .outputOptions('-compression_level 8')
    .pipe()
}

module.exports = { flacEncoder };
