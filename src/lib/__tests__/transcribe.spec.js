const { transcribe } = require('../transcribe')
const { recognize } = require('../googleCloud')
const { FORMATS } = require('../../constants')
const punctuationFormat = require('../formats/punctuation')
const defaultFormat = require('../formats/default')

jest.mock('../googleCloud')

jest.mock('../formats/default')
jest.mock('../formats/punctuation')

describe('transcribe()', () => {
  const gcsKey = 'sample-key'

  beforeEach(() => {
    jest.clearAllMocks()
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
    it('calls defaultFormatter.encodeResult with result', async () => {
      await transcribe(gcsKey, { diarization: false })
      expect(defaultFormat.encodeResult).toBeCalled()
    })

    it('calls punctuationFormatter.encodeResult with result if params.transcriptForamt is set to PUNCTUATION', async () => {
      await transcribe(gcsKey, {
        diarization: false,
        transcriptFormat: FORMATS.PUNCTUATION.key
      })

      expect(punctuationFormat.encodeResult).toBeCalled()
    })
  })

  describe('when params.diarization is true', () => {
    it('calls defaultFormatter.encodeDiarizedResult with result', async () => {
      await transcribe(gcsKey, { diarization: true })
      expect(defaultFormat.encodeDiarizedResult).toBeCalled()
    })

    it('calls punctuationFormatter.encodeResult with result if params.transcriptForamt is set to PUNCTUATION', async () => {
      await transcribe(gcsKey, {
        diarization: true,
        transcriptFormat: FORMATS.PUNCTUATION.key
      })

      expect(punctuationFormat.encodeDiarizedResult).toBeCalled()
    })
  })
})
