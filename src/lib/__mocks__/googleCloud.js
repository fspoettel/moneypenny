const path = require('path')
const fsPromises = require('fs/promises')

const recognize = jest.fn((config) => {
  const shouldDiarize = config.config.diarizationConfig?.enableSpeakerDiarization

  return fsPromises.readFile(
    path.join(
      process.cwd(),
      '__recordings__',
      `sample-response${shouldDiarize ? '-diarize' : ''}.json`
    )
  )
    .then((file) => JSON.parse(file))
})

module.exports = { recognize }
