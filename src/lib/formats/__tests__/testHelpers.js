const fsPromises = require('fs/promises')
const path = require('path')

const getMockResult = () =>
  fsPromises.readFile(path.join(process.cwd(), '__recordings__', 'sample-response.json'))
    .then(file => JSON.parse(file))

const getMockDiarizedResult = () =>
  fsPromises.readFile(path.join(process.cwd(), '__recordings__', 'sample-response-diarize.json'))
    .then(file => JSON.parse(file))

const TRANSCRIPT_FIXTURES = {
  EMPTY: { results: [] },
  SINGLE_WORD: {
    results: [
      {
        alternatives: [{
          transcript: 'foo',
          words: [{
            word: 'foo',
            startTime: { seconds: 0, nanos: 0 },
            endTime: { seconds: 2, nanos: 0 }
          }]
        }]
      }
    ]
  }
}

const TRANSCRIPT_FIXTURES_DIARIZED = {
  EMPTY: { results: [] },
  SINGLE_WORD: {
    results: [
      {
        alternatives: [{
          transcript: 'foo',
          words: [{
            word: 'foo',
            startTime: { seconds: 0, nanos: 0 },
            endTime: { seconds: 2, nanos: 0 },
            speakerTag: 1
          }]
        }]
      }
    ]
  },
  SPEAKER_CONSTANT: {
    results: [
      {
        alternatives: [{
          transcript: 'foo',
          words: [{
            word: 'foo',
            startTime: { seconds: 0, nanos: 0 },
            endTime: { seconds: 2, nanos: 0 },
            speakerTag: 1
          }, {
            word: 'bar',
            startTime: { seconds: 2, nanos: 0 },
            endTime: { seconds: 4, nanos: 0 },
            speakerTag: 1
          }]
        }]
      }
    ]
  }
}

module.exports = { getMockResult, getMockDiarizedResult, TRANSCRIPT_FIXTURES, TRANSCRIPT_FIXTURES_DIARIZED }
