const { recognize } = require('./googleCloud')
const { getDefaultValue } = require('./helpers')
const defaultFormat = require('./formats/default')
const {
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
      enableAutomaticPunctuation: (params.punctuation ?? true) && lang.punctuation,
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
      }
    },
    audio: { uri: `gs://${GOOGLE_BUCKET}/${gcsKey}` }
  }

  debug(`Starting [${languageCode}] transcribe for file ${gcsKey}`, config)
  const response = await recognize(config)

  debug(`Finished transcribe for file: ${gcsKey}`)
  if (shouldDiarize) return `${defaultFormat.encodeDiarizedResult(response, params.forceSubAtZero)}\n`
  return `${defaultFormat.encodeResult(response, params.forceSubAtZero).text}\n`
}

module.exports = { transcribe }
