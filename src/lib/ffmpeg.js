const ffmpeg = require('fluent-ffmpeg')
const debug = require('debug')('app:ffmpeg')

function getMetadata (filepath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) return reject(err)
      return resolve(metadata)
    })
  })
}

async function getAudioSampleRate (filepath) {
  const metadata = await getMetadata(filepath)
  if (!Array.isArray(metadata.streams)) return null

  const audioStreams = metadata.streams.filter(x => x.codec_type === 'audio')
  if (audioStreams.length === 0) return null

  // ffmpeg chooses the first audio track by default if there are more than 1 audio track (e.g. mkv)
  return audioStreams[0].sample_rate
}

function flacEncoder (input, sampleRate) {
  const encoder = ffmpeg()
    .input(input)
    .noVideo()
    .audioChannels(1)
    .format('flac')
    .outputOptions('-compression_level 8')

  if (sampleRate >= 8000 && sampleRate <= 48000) {
    debug(`Encoding flac with input sample_rate: ${sampleRate}`)
    return encoder.pipe()
  }

  const targetSampleRate = sampleRate % 44100 === 0 ? 44100 : 48000
  debug(`Resampling & encoding flac to target sample_rate: ${targetSampleRate}`)
  return encoder.audioFrequency(targetSampleRate).pipe()
}

module.exports = { getAudioSampleRate, flacEncoder }
