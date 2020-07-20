const { recognize } = require('./googleCloud');
const { fmtTime, getDefaultValue } = require('./helpers');
const { MODEL, INTERACTION_TYPE, MICROPHONE_DISTANCE, RECORDING_TYPE_DEVICE, LANGUAGES } = require('../constants');
const debug = require('debug')('app:transcribe');

const { GOOGLE_BUCKET } = process.env;

async function transcribe(gcsUri, params) {
  const languageCode = params.languageCode ?? 'en-US';
  const lang = LANGUAGES[languageCode];
  const shouldDiarize = (params.diarization ?? false) && lang.diarization;

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
  const response = await recognize(config);

  debug(`Finished transcribe for file: ${gcsUri}`);
  if (shouldDiarize) return `${diarizedResponseToSrt(response)}\n`;
  return `${responseToSrt(response)}\n`;
}

function responseToSrt({ results }) {
  return results
  .reduce((acc, curr, index) => {
    const { alternatives } = curr;
    if (!Array.isArray(alternatives) || alternatives.length === 0) return acc;

    const { transcript, words } = alternatives[0];
    if (!transcript || !Array.isArray(words) || !words[0]) return acc;

    const firstWord = words[0];
    const lastWord = words[words.length - 1];

    const timeStart = fmtTime(firstWord?.startTime);
    const timeEnd = fmtTime(lastWord?.endTime);

    const passage = `${index + 1}\n${timeStart} --> ${timeEnd}\n${transcript.trim()}`;
    return acc ? `${acc}\n\n${passage}` : passage;
  }, '');
}

function diarizedResponseToSrt({ results }) {
  const lastResult = results[results.length - 1];
  const { words } = lastResult.alternatives[0];

  const res = words
    .reduce((acc, curr, i, arr) => {
      const {
        content,
        index,
        lastEndTime,
        lastSpeakerTag,
        passage,
      } = acc;
      const { speakerTag, word } = curr;

      const hasSpeakerChanged = lastSpeakerTag !== speakerTag;

      const nextAcc = {
        lastEndTime: curr.endTime,
        lastSpeakerTag: speakerTag,
      }

      if (!hasSpeakerChanged) {
        return {
          ...nextAcc,
          index: index,
          content: content,
          passage: `${passage} ${word}`,
        };
      }

      const prevToken = `${content}${fmtTime(lastEndTime)}\n${passage}`;
      const nextToken = `${index}\n${fmtTime(curr.startTime)} --> `;

      let nextContent;

      if (i === 0) {
        nextContent = nextToken;
      } else if (i === arr.length - 1) {
        nextContent = prevToken;
      } else {
        nextContent = `${prevToken}\n\n${nextToken}`;
      }

      return {
        ...nextAcc,
        index: index + 1,
        content: nextContent,
        passage: `[Speaker ${speakerTag}] ${word}`,
      };
    }, {
      passage: '',
      content: '',
      index: 1,
      lastEndTime: null,
      lastSpeakerTag: null,
    });

  return res.content;
}

module.exports = { transcribe };

