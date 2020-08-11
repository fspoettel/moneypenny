const os = require('os')
const bcrypt = require('bcrypt')
const request = require('supertest')
const path = require('path')
const pool = require('../../db/pg')
const { makeApp } = require('../../app')
const { gcsUploadStream, removeObject } = require('../../lib/googleCloud')
const { getAudioSampleRate, flacEncoder } = require('../../lib/ffmpeg')
const { transcribe } = require('../../lib/transcribe')
const {
  FILE_FORMATS,
  INTERACTION_TYPE,
  RECORDING_TYPE_DEVICE,
  TRANSCRIPT_FORMATS,
  MICROPHONE_DISTANCE
} = require('../../constants')

Date.now = jest.fn(() => 1597083792000)

jest.mock('../../db/pg')
jest.mock('../../lib/googleCloud')
jest.mock('../../lib/ffmpeg')
jest.mock('../../lib/transcribe', () => ({
  transcribe: jest.fn(() => Promise.resolve(''))
}))

describe('POST /transcribe', () => {
  let app
  beforeEach(() => {
    app = makeApp()
    jest.clearAllMocks()
  })

  describe('when not logged in', () => {
    it('sends a `401` error', (done) => {
      request(app)
        .post('/transcribe')
        .end((err, res) => {
          if (err) return done(err)
          expect(res.status).toEqual(401)
          done()
        })
    })
  })

  describe('when logged in', () => {
    let cookie

    pool.connect.mockImplementation(async () => {
      const password = await bcrypt.hash('bar', 10)
      return {
        id: 'foo-id',
        username: 'foo',
        password
      }
    })

    beforeEach(async () => {
      await request(app)
        .post('/login?username=foo&password=bar')
        .then((res) => { cookie = res.header['set-cookie'] })
    })

    describe('when an invalid file is uploaded', () => {
      const req = () => request(app)
        .post('/transcribe')
        .set('cookie', cookie)

      it('sends `400` error if no file is uploaded', (done) => {
        req()
          .field('language_code', 'en-US')
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(400)
            expect(res.body.message).toEqual('Error while processing file.')
            done()
          })
      })

      it('sends `400` error if file is not a media file', (done) => {
        req()
          .attach('file', path.join(process.cwd(), '__fixtures__/sample-response.json'))
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(400)
            expect(res.body.message).toEqual('Error while processing file.')
            done()
          })
      })

      it('sends `400` error if sample_rate is too low', (done) => {
        getAudioSampleRate.mockImplementationOnce(() => 4000)

        req()
          .attach('file', path.join(process.cwd(), '__fixtures__/yougotmail.mp3'))
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(400)
            expect(res.body.message).toEqual('Sample rates below 8,000 Hz are not supported')
            done()
          })
      })
    })

    describe('when a valid file is uploaded', () => {
      const req = () => request(app)
        .post('/transcribe')
        .set('cookie', cookie)
        .attach('file', path.join(process.cwd(), '__fixtures__/yougotmail.mp3'))
        .field('language_code', 'en-US')

      it('sends a `200` response', (done) => {
        req().end((err, res) => {
          if (err) return done(err)
          expect(res.status).toEqual(200)
          done()
        })
      })

      it('calls processing modules with correct params', (done) => {
        req()
          .field('speaker_count', '2')
          .field('diarization', 'on')
          .field('punctuation', 'on')
          .field('profanity_filter', 'on')
          .field('force_sub_at_zero', 'on')
          .field('industry_code', '61231')
          .field('microphone_distance', MICROPHONE_DISTANCE.NEARFIELD.key)
          .field('interaction_type', INTERACTION_TYPE.INTERACTION_TYPE_UNSPECIFIED.key)
          .field('recording_type_device', RECORDING_TYPE_DEVICE.RECORDING_DEVICE_TYPE_UNSPECIFIED.key)
          .field('transcript_format', TRANSCRIPT_FORMATS.PUNCTUATION.key)
          .field('phrases', 'foo,bar')
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(200)
            expect(gcsUploadStream).toBeCalledWith('1597083792000-yougotmail.flac')
            expect(removeObject).toBeCalledWith('1597083792000-yougotmail.flac')
            expect(transcribe.mock.calls).toMatchSnapshot()
            expect(flacEncoder).toBeCalledWith(path.join(os.tmpdir(), '1597083792000-yougotmail.mp3'), 44100)
            done()
          })
      })

      it('returns an .srt file if `file_format` field is set', (done) => {
        req()
          .field('file_format', FILE_FORMATS.SRT.key)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(200)
            expect(res.header['content-disposition'].includes('yougotmail.srt')).toBeTruthy()
            expect(res.header['content-type']).toEqual('text/plain; charset=utf-8')
            done()
          })
      })

      it('returns an .txt file if `file_format` field is set', (done) => {
        req()
          .end((err, res) => {
            if (err) return done(err)
            expect(res.status).toEqual(200)
            expect(res.header['content-disposition'].includes('yougotmail.txt')).toBeTruthy()
            expect(res.header['content-type']).toEqual('text/plain; charset=utf-8')
            done()
          })
      })
    })
  })
})
