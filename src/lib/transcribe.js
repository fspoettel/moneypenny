const { recognize } = require('./googleCloud');
const { fmtTime, getDefaultValue } = require('./helpers');
const { MODEL, INTERACTION_TYPE, MICROPHONE_DISTANCE, RECORDING_TYPE_DEVICE, LANGUAGES } = require('../constants');
const debug = require('debug')('app:transcribe');

const { GOOGLE_BUCKET } = process.env;

async function transcribe(gcsUri, params) {
  const languageCode = params.languageCode ?? 'en-US';
  const lang = LANGUAGES[languageCode];
  const shouldDiarize = (params.diarization ?? false) && lang.diarize;

  const diarizationConfig = shouldDiarize ? {
    enableSpeakerDiarization: shouldDiarize,
    minSpeakerCount: params.speakerCount ?? 2,
    maxSpeakerCount: params.speakerCount ?? 2,
  } : undefined;

  const config = {
    config: {
      encoding: 'FLAC',
      languageCode,
      maxAlternatives: 1,
      profanityFilter: params.profanityFilter ?? false,
      enableWordTimeOffsets: true,
      enableWordConfidence: false,
      enableAutomaticPunctuation: (params.punctuation ?? true) && lang.punctuation,
      diarizationConfig,
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

  debug(`Starting [${languageCode}] transcribe for file ${gcsUri}`, config);
  const { results } = await recognize(config);
  debug(`Finished transcribe for file: ${gcsUri}`);

  if (shouldDiarize) {
    const lastResult = results[results.length - 1];
    const { words } = lastResult.alternatives[0];

    return words
      .reduce((acc, curr, index, arr) => {
        const { startTime, speakerTag, word } = curr;
        if (index > 0 && speakerTag === arr[index - 1].speakerTag) return `${acc} ${word}`;

        const lines = `[${fmtTime(startTime.seconds)}] Speaker ${speakerTag}:\n${word}`;

        if (index === 0) return lines;
        return `${acc}\n\n${lines}`;
      }, '');
  }

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
