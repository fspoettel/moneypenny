function Ffmpeg () {
  this.audioChannels = jest.fn(() => this)
  this.audioFrequency = jest.fn(() => this)
  this.format = jest.fn(() => this)
  this.input = jest.fn(() => this)
  this.noVideo = jest.fn(() => this)
  this.outputOptions = jest.fn(() => this)
  this.pipe = jest.fn(() => this)
  return this
}

Ffmpeg.ffprobe = jest.fn((filepath, callback) => {
  return callback(null, {
    streams: [
      { codec_type: 'video' },
      { codec_type: 'audio', sample_rate: 44100 },
      { codec_type: 'audio', sample_rate: 48000 }
    ]
  })
})

module.exports = Ffmpeg
