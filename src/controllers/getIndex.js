const {
  INTERACTION_TYPE,
  MICROPHONE_DISTANCE,
  RECORDING_TYPE_DEVICE,
  LANGUAGE_ARRAY,
  TRANSCRIPT_FORMATS,
  FILE_FORMATS
} = require('../constants')

const getIndex = (req, res) => {
  res.render('index.njk', {
    limitMb: process.env.UPLOAD_LIMIT_MB,
    title: 'Moneypenny',
    transcriptFormats: Object.values(TRANSCRIPT_FORMATS),
    fileFormats: Object.values(FILE_FORMATS),
    languages: LANGUAGE_ARRAY,
    interactionTypes: Object.values(INTERACTION_TYPE),
    microphoneDistances: Object.values(MICROPHONE_DISTANCE),
    recordingDeviceTypes: Object.values(RECORDING_TYPE_DEVICE)
  })
}

module.exports = getIndex
