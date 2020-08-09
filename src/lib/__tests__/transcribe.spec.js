const { transcribe } = require('../transcribe')
const { recognize } = require('../googleCloud')
const { FORMATS } = require('../../constants')

jest.mock('../googleCloud')

describe('transcribe()', () => {
  const gcsKey = 'sample-key'

  beforeEach(() => {
    recognize.mockClear()
  })

  describe('always', () => {
    it('calls recognize() with a set of default params', async () => {
      await transcribe(gcsKey)
      expect(recognize).toBeCalledTimes(1)
      expect(recognize.mock.calls).toMatchSnapshot()
    })

    it('throws error if recognize() fails', () => {
      recognize.mockImplementationOnce(() => Promise.reject(new TypeError('recognize failed')))
      return expect(transcribe(gcsKey)).rejects.toBeInstanceOf(TypeError)
    })
  })

  describe('when params.diarization is false', () => {
    describe('when params.forceZeroSub is false', () => {
      it('parses recognize() response to an undiarized .srt', async () => {
        const result = await transcribe(gcsKey, { diarization: false, forceSubAtZero: false })
        expect(result).toMatchSnapshot()
      })

      it('parses recognize() response to an undiarized .srt in punctuation format', async () => {
        const result = await transcribe(gcsKey, {
          diarization: false,
          forceSubAtZero: false,
          transcriptFormat: FORMATS.PUNCTUATION.key
        })
        expect(result).toMatchSnapshot()
      })
    })

    describe('when params.forceZeroSub is true', () => {
      it('parses recognize() response to an undiarized .srt string and forces a zero sub', async () => {
        const result = await transcribe(gcsKey, { diarization: false, forceSubAtZero: true })
        expect(result).toMatchSnapshot()
      })

      it('parses recognize() response to an undiarized .srt string in punctuation format and forces a zero sub', async () => {
        const result = await transcribe(gcsKey, {
          diarization: false,
          forceSubAtZero: true,
          transcriptFormat: FORMATS.PUNCTUATION.key
        })

        expect(result).toMatchSnapshot()
      })
    })
  })

  describe('when params.diarization is true', () => {
    describe('when params.forceZeroSub is false', () => {
      it('parses diarized recognize() response to a diarized .srt', async () => {
        const result = await transcribe(gcsKey, { diarization: true, forceZeroSub: false })
        expect(result).toMatchSnapshot()
      })

      it('parses recognize() response to a diarized.srt in punctuation format', async () => {
        const result = await transcribe(gcsKey, {
          diarization: true,
          forceSubAtZero: false,
          transcriptFormat: FORMATS.PUNCTUATION.key
        })

        expect(result).toMatchSnapshot()
      })
    })
  })

  describe('when params.forceZeroSub is true', () => {
    it('parses recognize() response to a diarized .srt and forces a zero sub', async () => {
      const result = await transcribe(gcsKey, { diarization: true, forceSubAtZero: true })
      expect(result).toMatchSnapshot()
    })

    it('parses recognize() response to a .srt string and forces zero sub in punctuation format and forces a zero sub', async () => {
      const result = await transcribe(gcsKey, {
        transcriptFormat: FORMATS.PUNCTUATION.key,
        diarization: true,
        forceSubAtZero: true
      })
      expect(result).toMatchSnapshot()
    })
  })
})
