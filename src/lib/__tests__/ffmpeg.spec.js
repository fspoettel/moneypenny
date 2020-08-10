const { getAudioSampleRate, flacEncoder } = require('../ffmpeg')
const Ffmpeg = require('fluent-ffmpeg')
jest.mock('fluent-ffmpeg')

describe('ffmpeg', () => {
  describe('getAudioSampleRate ()', () => {
    it('returns the sample_rate of the first audio stream', async () => {
      const result = await getAudioSampleRate('sample-path')
      expect(result).toEqual(44100)
    })

    it('returns null if no streams are present', async () => {
      Ffmpeg.ffprobe.mockImplementationOnce((filepath, callback) => {
        callback(null, { streams: [] })
      })

      const result = await getAudioSampleRate('sample-path')
      expect(result).toBeNull()
    })

    it('returns null if no audio streams are present', async () => {
      Ffmpeg.ffprobe.mockImplementationOnce((filepath, callback) => {
        callback(null, { streams: [{ codec_type: 'video' }] })
      })

      const result = await getAudioSampleRate('sample-path')
      expect(result).toBeNull()
    })
  })

  describe('flacEncoder()', () => {
    it('setups ffmpeg encoder correctly', () => {
      const instance = flacEncoder('sample=input')
      expect(instance.input).toBeCalledWith('sample=input')
      expect(instance.format).toBeCalledWith('flac')
      expect(instance.audioChannels).toBeCalledWith(1)
      expect(instance.outputOptions).toBeCalledWith('-compression_level 8')
      expect(instance.noVideo).toBeCalledWith()
      expect(instance.pipe).toBeCalledWith()
    })

    it('does not resample if sample_rate is supported by Google', () => {
      const instance = flacEncoder('sample=input', 44100)
      expect(instance.audioFrequency).not.toBeCalled()
    })

    it('resamples multiples of 44100 to 44100', () => {
      const instance = flacEncoder('sample=input', 88200)
      expect(instance.audioFrequency).toBeCalledWith(44100)
    })

    it('resamples multiples of 48000 to 48000', () => {
      const instance = flacEncoder('sample=input', 96000)
      expect(instance.audioFrequency).toBeCalledWith(48000)
    })

    it('resamples everything else to 48000', () => {
      const instance = flacEncoder('sample=input', 48001)
      expect(instance.audioFrequency).toBeCalledWith(48000)
    })
  })
})
