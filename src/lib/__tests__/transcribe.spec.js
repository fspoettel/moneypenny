const { transcribe } = require('../transcribe')
const { recognize } = require('../googleCloud')

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

  describe('when params.diarization is true', () => {
    it('parses recognize() response to a .srt string', async () => {
      const result = await transcribe(gcsKey, { diarization: false })
      expect(result).toMatchSnapshot()
    })
  })

  describe('when params.diarization is false', () => {
    it('parses diarized recognize() response to a .srt string', async () => {
      const result = await transcribe(gcsKey, { diarization: true })
      expect(result).toMatchSnapshot()
    })
  })
})
