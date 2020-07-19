const { LANGUAGES, INTERACTION_TYPE, MICROPHONE_DISTANCE, RECORDING_TYPE_DEVICE } = require('../constants');

const getIndex = (req, res) => {
  res.render('index.njk', {
    title: 'Speech-To-Transcript',
    languages: LANGUAGES,
    interactionTypes: Object.values(INTERACTION_TYPE),
    microphoneDistances: Object.values(MICROPHONE_DISTANCE),
    recordingDeviceTypes: Object.values(RECORDING_TYPE_DEVICE),
  });
};

module.exports = getIndex;
