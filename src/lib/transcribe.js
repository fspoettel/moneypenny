const { recognize } = require('./googleCloud')
const { getDefaultValue } = require('./helpers')
const defaultFormat = require('./formats/default')
const punctuationFormat = require('./formats/punctuation')
const {
  TRANSCRIPT_FORMATS,
  INTERACTION_TYPE,
  LANGUAGES,
  MICROPHONE_DISTANCE,
  MODEL,
  ORIGINAL_MEDIA_TYPE,
  RECORDING_TYPE_DEVICE
} = require('../constants')
const debug = require('debug')('app:transcribe')

const { GOOGLE_BUCKET } = process.env

async function transcribe (gcsKey, params = {}) {
  const languageCode = params.languageCode ?? 'en-US'
  const lang = LANGUAGES[languageCode]

  const isPunctuationFormat = params.transcriptFormat === TRANSCRIPT_FORMATS.PUNCTUATION.key &&
    lang.punctuation
  const format = isPunctuationFormat ? punctuationFormat : defaultFormat

  const shouldDiarize = (params.diarization ?? false) && lang.diarization
  const diarizationConfig = shouldDiarize ? {
    enableSpeakerDiarization: shouldDiarize,
    minSpeakerCount: params.speakerCount ?? 2,
    maxSpeakerCount: params.speakerCount ?? 2
  } : undefined

  const config = {
    config: {
      encoding: 'FLAC',
      languageCode,
      maxAlternatives: 1,
      profanityFilter: params.profanityFilter ?? false,
      enableWordTimeOffsets: true,
      enableWordConfidence: false,
      enableAutomaticPunctuation: ((params.punctuation ?? true) && lang.punctuation) || isPunctuationFormat,
      diarizationConfig,
      useEnhanced: true,
      model: params.model ?? getDefaultValue(MODEL),
      metadata: {
        industryNaicsCodeOfAudio: params.industryNaicsCodeOfAudio ?? undefined,
        interactionType: params.interactionType ?? getDefaultValue(INTERACTION_TYPE),
        microphoneDistance: params.microphoneDistance ?? getDefaultValue(MICROPHONE_DISTANCE),
        originalMediaType: params.originalMediaType ?? getDefaultValue(ORIGINAL_MEDIA_TYPE),
        originalMimeType: params.originalMimeType,
        recordingDeviceType: params.recordingDeviceType ?? getDefaultValue(RECORDING_TYPE_DEVICE)
      },
      speechContexts: params.phrases
        ? [{ phrases: params.phrases }]
        : undefined
    },
    audio: { uri: `gs://${GOOGLE_BUCKET}/${gcsKey}` }
  }

  debug(`Starting [${languageCode}] transcribe for file ${gcsKey}`, config)
  const response = await recognize(config)

  debug(`Finished transcribe for file: ${gcsKey}`)
  if (shouldDiarize) return `${format.encodeDiarizedResult(response, params.forceSubAtZero)}\n`
  return `${format.encodeResult(response, params.forceSubAtZero)}\n`
}

module.exports = { transcribe }
