const {
  INTERACTION_TYPE,
  LANGUAGES,
  MICROPHONE_DISTANCE,
  RECORDING_TYPE_DEVICE,
} = require('../constants');

const getIndex = (req, res) => {
  res.render('index.njk', {
    limitMb: process.env.UPLOAD_LIMIT_MB,
    title: 'Moneypenny',
    languages: LANGUAGES,
    interactionTypes: Object.values(INTERACTION_TYPE),
    microphoneDistances: Object.values(MICROPHONE_DISTANCE),
    recordingDeviceTypes: Object.values(RECORDING_TYPE_DEVICE),
  });
};

module.exports = getIndex;
