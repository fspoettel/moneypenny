const path = require('path')
const fsPromises = require('fs/promises')
const { PassThrough } = require('stream')

const recognize = jest.fn((config) => {
  const shouldDiarize = config.config.diarizationConfig?.enableSpeakerDiarization

  return fsPromises.readFile(
    path.join(
      process.cwd(),
      '__fixtures__',
      `sample-response${shouldDiarize ? '-diarize' : ''}.json`
    )
  )
    .then((file) => JSON.parse(file))
})

const gcsUploadStream = jest.fn((gcsKey) => ({
  writeStream: new PassThrough(),
  promise: Promise.resolve(gcsKey)
}))

const removeObject = jest.fn(() => Promise.resolve())

module.exports = { gcsUploadStream, removeObject, recognize }
