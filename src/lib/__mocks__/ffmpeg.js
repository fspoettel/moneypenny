const { PassThrough } = require('stream')

const getAudioSampleRate = jest.fn(() => 44100)

const flacEncoder = jest.fn(() => new PassThrough())

module.exports = { flacEncoder, getAudioSampleRate }
