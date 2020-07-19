const { recognize } = require('./googleCloud');
const { fmtTime, getDefaultValue } = require('./helpers');
const { MODEL, INTERACTION_TYPE, MICROPHONE_DISTANCE, RECORDING_TYPE_DEVICE } = require('../constants');
const debug = require('debug')('app:transcribe');

const { GOOGLE_BUCKET } = process.env;

async function transcribe(gcsUri, params) {
  const languageCode = params.languageCode ?? 'en-US';
  const speakerCount = params.speakerCount ?? 2;

  const config = {
    config: {
      encoding: 'FLAC',
      languageCode,
      maxAlternatives: 1,
      profanityFilter: params.profanityFilter ?? false,
      enableWordTimeOffsets: true,
      enableWordConfidence: false,
      enableAutomaticPunctuation: params.punctuation ?? true,
      diarizationConfig: {
        enableSpeakerDiarization: speakerCount > 1,
        minSpeakerCount: speakerCount,
        maxSpeakerCount: speakerCount,
      },
      useEnhanced: true,
      model: params.model ?? getDefaultValue(MODEL),
      metadata: {
        industryNaicsCodeOfAudio: params.industryNaicsCodeOfAudio ?? undefined,
        interactionType: params.interactionType ?? getDefaultValue(INTERACTION_TYPE),
        microphoneDistance: params.microphoneDistance ?? getDefaultValue(MICROPHONE_DISTANCE),
        originalMediaType: params.originalMediaType,
        originalMimeType: params.originalMimeType,
        recordingDeviceType: params.recordingDeviceType ?? getDefaultValue(RECORDING_TYPE_DEVICE),
      },
    },
    audio: { uri: `gs://${GOOGLE_BUCKET}/${gcsUri}` },
  };

  debug(`Starting [${languageCode}] transcribe for file ${gcsUri}`, params);
  const { results } = await recognize(config);
  debug(`Finished transcribe for file: ${gcsUri}`);

  return results
    .reduce((acc, curr) => {
      const { alternatives } = curr;
      if (!Array.isArray(alternatives) || alternatives.length === 0) return acc;

      const { transcript, words } = alternatives[0];
      if (!transcript || !Array.isArray(words) || !words[0]) return acc;

      const timestamp = `[${fmtTime(words[0]?.startTime?.seconds || 0)}]`;
      const passage = `${timestamp}\n${transcript}`;

      return acc ? `${acc}\n\n${passage}` : passage;
    }, '');
}

module.exports = { transcribe };
