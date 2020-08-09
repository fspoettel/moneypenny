
class ValidationError extends Error {}

class LimitError extends Error {}

class UnauthenticatedError extends Error {}

const FORMATS = {
  DEFAULT: {
    isDefault: true,
    description: 'Split by passages',
    key: 'DEFAULT'
  },
  PUNCTUATION: {
    description: 'Split by punctuation',
    key: 'PUNCTUATION'
  }
}

const INTERACTION_TYPE = {
  INTERACTION_TYPE_UNSPECIFIED: {
    description: 'Unknown or other',
    key: 'INTERACTION_TYPE_UNSPECIFIED'
  },
  PRESENTATION: {
    description: 'Lecture or presentation by one or multiple people, mostly uninterrupted',
    key: 'PRESENTATION'
  },
  PHONE_CALL: {
    isDefault: true,
    description: 'Phone-call or video-conference',
    key: 'PHONE_CALL'
  },
  DISCUSSION: {
    description: 'Conversation, discussion or meeting in one room',
    key: 'DISCUSSION'
  },
  PROFESSIONALLY_PRODUCED: {
    description: 'Professionally produced audio (eg. TV Show, Podcast).',
    key: 'PROFESSIONALLY_PRODUCED'
  },
  DICTATION: {
    description: 'Speech-to-text input',
    key: 'DICTATION'
  },
  VOICEMAIL: {
    description: 'Recorded message intended for another person to listen to.',
    key: 'VOICEMAIL'
  },
  VOICE_SEARCH: {
    description: 'Spoken questions and queries, e.g. Siri prompts',
    key: 'VOICE_SEARCH'
  },
  VOICE_COMMAND: {
    description: 'Voice commands, such as for controlling a device.',
    key: 'VOICE_COMMAND'
  }
}

const MICROPHONE_DISTANCE = {
  MICROPHONE_DISTANCE_UNSPECIFIED: {
    description: 'Unknown',
    key: 'MICROPHONE_DISTANCE_UNSPECIFIED'
  },
  NEARFIELD: {
    isDefault: true,
    description: 'Within 1 meters of speaker. Eg. phone, headset, or handheld microphone',
    key: 'NEARFIELD'
  },
  MIDFIELD: {
    description: 'Within 3 meters of speaker',
    key: 'MIDFIELD'
  },
  FARFIELD: {
    description: 'More than 3 meters away from speaker',
    key: 'FARFIELD'
  }
}

const ORIGINAL_MEDIA_TYPE = {
  ORIGINAL_MEDIA_TYPE_UNSPECIFIED: {
    isDefault: true,
    description: 'Unknown original media type.',
    key: 'ORIGINAL_MEDIA_TYPE_UNSPECIFIED'
  },
  AUDIO: {
    description: 'Audio recording.',
    key: 'AUDIO'
  },
  VIDEO: {
    description: 'Originally recorded on a video.',
    key: 'VIDEO'
  }
}

const RECORDING_TYPE_DEVICE = {
  RECORDING_DEVICE_TYPE_UNSPECIFIED: {
    isDefault: true,
    description: 'Unknown',
    key: 'RECORDING_DEVICE_TYPE_UNSPECIFIED'
  },
  SMARTPHONE: {
    description: 'Smartphone',
    key: 'SMARTPHONE'
  },
  PC: {
    description: 'Personal computer or tablet',
    key: 'PC'
  },
  PHONE_LINE: {
    description: 'Phone line',
    key: 'PHONE_LINE'
  },
  VEHICLE: {
    description: 'Vehicle',
    key: 'VEHICLE'
  },
  OTHER_OUTDOOR_DEVICE: {
    description: 'Outdoors',
    key: 'OTHER_OUTDOOR_DEVICE'
  },
  OTHER_INDOOR_DEVICE: {
    description: 'Indoors',
    key: 'OTHER_INDOOR_DEVICE'
  }
}

const MODEL = {
  command_and_search: {
    description: 'Best for short queries such as voice commands or voice search.',
    key: 'command_and_search'
  },
  phone_call: {
    description: 'Best for audio that originated from a phone call (typically recorded at an 8khz sampling rate).',
    key: 'phone_call'
  },
  video: {
    description: 'Best for audio that originated from from video or includes multiple speakers. Ideally the audio is recorded at a 16khz or greater sampling rate. This is a premium model that costs more than the standard rate.',
    key: 'video'
  },
  default: {
    isDefault: true,
    description: 'Best for audio that is not one of the specific audio models. For example, long-form audio. Ideally the audio is high-fidelity, recorded at a 16khz or greater sampling rate.',
    key: 'default'
  }
}

/* Go to https://cloud.google.com/speech-to-text/docs/languages
 * and run:
Array.from(document.querySelectorAll('#lang-table-container tbody tr'))
  .map(el => Array.from(el.querySelectorAll('td')))
  .filter(children => children[2].innerHTML === 'Default')
  .map(children => {
    return {
      code: children[1].innerHTML,
      description: children[0].innerHTML,
      profanity: children[4].innerHTML === '✔',
      punctuation: children[5].innerHTML === '✔',
      diarization: children[6].innerHTML === '✔',
      ...(children[1].innerHTML === 'de-DE' ? { isDefault: true } : {})
    };
  })
  .reduce((acc, curr) => ({ ...acc, [curr.code]: curr }), {});
*/
const LANGUAGES = {
  'af-ZA': {
    code: 'af-ZA',
    description: 'Afrikaans (South Africa)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'sq-AL': {
    code: 'sq-AL',
    description: 'Albanian (Albania)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'am-ET': {
    code: 'am-ET',
    description: 'Amharic (Ethiopia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ar-DZ': {
    code: 'ar-DZ',
    description: 'Arabic (Algeria)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ar-BH': {
    code: 'ar-BH',
    description: 'Arabic (Bahrain)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-EG': {
    code: 'ar-EG',
    description: 'Arabic (Egypt)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-IQ': {
    code: 'ar-IQ',
    description: 'Arabic (Iraq)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-IL': {
    code: 'ar-IL',
    description: 'Arabic (Israel)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-JO': {
    code: 'ar-JO',
    description: 'Arabic (Jordan)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-KW': {
    code: 'ar-KW',
    description: 'Arabic (Kuwait)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-LB': {
    code: 'ar-LB',
    description: 'Arabic (Lebanon)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-MA': {
    code: 'ar-MA',
    description: 'Arabic (Morocco)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ar-OM': {
    code: 'ar-OM',
    description: 'Arabic (Oman)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-QA': {
    code: 'ar-QA',
    description: 'Arabic (Qatar)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-SA': {
    code: 'ar-SA',
    description: 'Arabic (Saudi Arabia)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-PS': {
    code: 'ar-PS',
    description: 'Arabic (State of Palestine)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-TN': {
    code: 'ar-TN',
    description: 'Arabic (Tunisia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ar-AE': {
    code: 'ar-AE',
    description: 'Arabic (United Arab Emirates)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ar-YE': {
    code: 'ar-YE',
    description: 'Arabic (Yemen)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'hy-AM': {
    code: 'hy-AM',
    description: 'Armenian (Armenia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'az-AZ': {
    code: 'az-AZ',
    description: 'Azerbaijani (Azerbaijan)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'eu-ES': {
    code: 'eu-ES',
    description: 'Basque (Spain)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'bn-BD': {
    code: 'bn-BD',
    description: 'Bengali (Bangladesh)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'bn-IN': {
    code: 'bn-IN',
    description: 'Bengali (India)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'bs-BA': {
    code: 'bs-BA',
    description: 'Bosnian (Bosnia and Herzegovina)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'bg-BG': {
    code: 'bg-BG',
    description: 'Bulgarian (Bulgaria)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'my-MM': {
    code: 'my-MM',
    description: 'Burmese (Myanmar)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ca-ES': {
    code: 'ca-ES',
    description: 'Catalan (Spain)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'yue-Hant-HK': {
    code: 'yue-Hant-HK',
    description: 'Chinese, Cantonese (Traditional Hong Kong)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'zh (cmn-Hans-CN)': {
    code: 'zh (cmn-Hans-CN)',
    description: 'Chinese, Mandarin (Simplified, China)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'zh-TW (cmn-Hant-TW)': {
    code: 'zh-TW (cmn-Hant-TW)',
    description: 'Chinese, Mandarin (Traditional, Taiwan)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'hr-HR': {
    code: 'hr-HR',
    description: 'Croatian (Croatia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'cs-CZ': {
    code: 'cs-CZ',
    description: 'Czech (Czech Republic)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'da-DK': {
    code: 'da-DK',
    description: 'Danish (Denmark)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'nl-BE': {
    code: 'nl-BE',
    description: 'Dutch (Belgium)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'nl-NL': {
    code: 'nl-NL',
    description: 'Dutch (Netherlands)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-AU': {
    code: 'en-AU',
    description: 'English (Australia)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'en-CA': {
    code: 'en-CA',
    description: 'English (Canada)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-GH': {
    code: 'en-GH',
    description: 'English (Ghana)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-HK': {
    code: 'en-HK',
    description: 'English (Hong Kong)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-IN': {
    code: 'en-IN',
    description: 'English (India)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'en-IE': {
    code: 'en-IE',
    description: 'English (Ireland)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-KE': {
    code: 'en-KE',
    description: 'English (Kenya)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-NZ': {
    code: 'en-NZ',
    description: 'English (New Zealand)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-NG': {
    code: 'en-NG',
    description: 'English (Nigeria)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-PK': {
    code: 'en-PK',
    description: 'English (Pakistan)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-PH': {
    code: 'en-PH',
    description: 'English (Philippines)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-SG': {
    code: 'en-SG',
    description: 'English (Singapore)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'en-ZA': {
    code: 'en-ZA',
    description: 'English (South Africa)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-TZ': {
    code: 'en-TZ',
    description: 'English (Tanzania)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'en-GB': {
    code: 'en-GB',
    description: 'English (United Kingdom)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'en-US': {
    code: 'en-US',
    description: 'English (United States)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'et-EE': {
    code: 'et-EE',
    description: 'Estonian (Estonia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'fil-PH': {
    code: 'fil-PH',
    description: 'Filipino (Philippines)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'fi-FI': {
    code: 'fi-FI',
    description: 'Finnish (Finland)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'fr-BE': {
    code: 'fr-BE',
    description: 'French (Belgium)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'fr-CA': {
    code: 'fr-CA',
    description: 'French (Canada)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'fr-FR': {
    code: 'fr-FR',
    description: 'French (France)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'fr-CH': {
    code: 'fr-CH',
    description: 'French (Switzerland)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'gl-ES': {
    code: 'gl-ES',
    description: 'Galician (Spain)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ka-GE': {
    code: 'ka-GE',
    description: 'Georgian (Georgia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'de-AT': {
    code: 'de-AT',
    description: 'German (Austria)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'de-DE': {
    code: 'de-DE',
    description: 'German (Germany)',
    profanity: true,
    punctuation: true,
    diarization: true,
    isDefault: true
  },
  'de-CH': {
    code: 'de-CH',
    description: 'German (Switzerland)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'el-GR': {
    code: 'el-GR',
    description: 'Greek (Greece)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'gu-IN': {
    code: 'gu-IN',
    description: 'Gujarati (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'iw-IL': {
    code: 'iw-IL',
    description: 'Hebrew (Israel)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'hi-IN': {
    code: 'hi-IN',
    description: 'Hindi (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'hu-HU': {
    code: 'hu-HU',
    description: 'Hungarian (Hungary)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'is-IS': {
    code: 'is-IS',
    description: 'Icelandic (Iceland)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'id-ID': {
    code: 'id-ID',
    description: 'Indonesian (Indonesia)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'it-IT': {
    code: 'it-IT',
    description: 'Italian (Italy)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'it-CH': {
    code: 'it-CH',
    description: 'Italian (Switzerland)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ja-JP': {
    code: 'ja-JP',
    description: 'Japanese (Japan)',
    profanity: true,
    punctuation: true,
    diarization: true
  },
  'jv-ID': {
    code: 'jv-ID',
    description: 'Javanese (Indonesia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'kn-IN': {
    code: 'kn-IN',
    description: 'Kannada (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'km-KH': {
    code: 'km-KH',
    description: 'Khmer (Cambodia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ko-KR': {
    code: 'ko-KR',
    description: 'Korean (South Korea)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'lo-LA': {
    code: 'lo-LA',
    description: 'Lao (Laos)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'lv-LV': {
    code: 'lv-LV',
    description: 'Latvian (Latvia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'lt-LT': {
    code: 'lt-LT',
    description: 'Lithuanian (Lithuania)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'mk-MK': {
    code: 'mk-MK',
    description: 'Macedonian (North Macedonia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ms-MY': {
    code: 'ms-MY',
    description: 'Malay (Malaysia)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ml-IN': {
    code: 'ml-IN',
    description: 'Malayalam (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'mr-IN': {
    code: 'mr-IN',
    description: 'Marathi (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'mn-MN': {
    code: 'mn-MN',
    description: 'Mongolian (Mongolia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ne-NP': {
    code: 'ne-NP',
    description: 'Nepali (Nepal)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'no-NO': {
    code: 'no-NO',
    description: 'Norwegian Bokmål (Norway)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'fa-IR': {
    code: 'fa-IR',
    description: 'Persian (Iran)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'pl-PL': {
    code: 'pl-PL',
    description: 'Polish (Poland)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'pt-BR': {
    code: 'pt-BR',
    description: 'Portuguese (Brazil)',
    profanity: false,
    punctuation: true,
    diarization: true
  },
  'pt-PT': {
    code: 'pt-PT',
    description: 'Portuguese (Portugal)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'pa-Guru-IN': {
    code: 'pa-Guru-IN',
    description: 'Punjabi (Gurmukhi India)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ro-RO': {
    code: 'ro-RO',
    description: 'Romanian (Romania)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ru-RU': {
    code: 'ru-RU',
    description: 'Russian (Russia)',
    profanity: false,
    punctuation: true,
    diarization: true
  },
  'sr-RS': {
    code: 'sr-RS',
    description: 'Serbian (Serbia)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'si-LK': {
    code: 'si-LK',
    description: 'Sinhala (Sri Lanka)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'sk-SK': {
    code: 'sk-SK',
    description: 'Slovak (Slovakia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'sl-SI': {
    code: 'sl-SI',
    description: 'Slovenian (Slovenia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-AR': {
    code: 'es-AR',
    description: 'Spanish (Argentina)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-BO': {
    code: 'es-BO',
    description: 'Spanish (Bolivia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-CL': {
    code: 'es-CL',
    description: 'Spanish (Chile)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-CO': {
    code: 'es-CO',
    description: 'Spanish (Colombia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-CR': {
    code: 'es-CR',
    description: 'Spanish (Costa Rica)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-DO': {
    code: 'es-DO',
    description: 'Spanish (Dominican Republic)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-EC': {
    code: 'es-EC',
    description: 'Spanish (Ecuador)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-SV': {
    code: 'es-SV',
    description: 'Spanish (El Salvador)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-GT': {
    code: 'es-GT',
    description: 'Spanish (Guatemala)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-HN': {
    code: 'es-HN',
    description: 'Spanish (Honduras)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-MX': {
    code: 'es-MX',
    description: 'Spanish (Mexico)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-NI': {
    code: 'es-NI',
    description: 'Spanish (Nicaragua)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-PA': {
    code: 'es-PA',
    description: 'Spanish (Panama)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-PY': {
    code: 'es-PY',
    description: 'Spanish (Paraguay)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-PE': {
    code: 'es-PE',
    description: 'Spanish (Peru)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-PR': {
    code: 'es-PR',
    description: 'Spanish (Puerto Rico)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-ES': {
    code: 'es-ES',
    description: 'Spanish (Spain)',
    profanity: false,
    punctuation: true,
    diarization: true
  },
  'es-US': {
    code: 'es-US',
    description: 'Spanish (United States)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'es-UY': {
    code: 'es-UY',
    description: 'Spanish (Uruguay)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'es-VE': {
    code: 'es-VE',
    description: 'Spanish (Venezuela)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'su-ID': {
    code: 'su-ID',
    description: 'Sundanese (Indonesia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'sw-KE': {
    code: 'sw-KE',
    description: 'Swahili (Kenya)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'sw-TZ': {
    code: 'sw-TZ',
    description: 'Swahili (Tanzania)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'sv-SE': {
    code: 'sv-SE',
    description: 'Swedish (Sweden)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'ta-IN': {
    code: 'ta-IN',
    description: 'Tamil (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ta-MY': {
    code: 'ta-MY',
    description: 'Tamil (Malaysia)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ta-SG': {
    code: 'ta-SG',
    description: 'Tamil (Singapore)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ta-LK': {
    code: 'ta-LK',
    description: 'Tamil (Sri Lanka)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'te-IN': {
    code: 'te-IN',
    description: 'Telugu (India)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'th-TH': {
    code: 'th-TH',
    description: 'Thai (Thailand)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'tr-TR': {
    code: 'tr-TR',
    description: 'Turkish (Turkey)',
    profanity: true,
    punctuation: false,
    diarization: true
  },
  'uk-UA': {
    code: 'uk-UA',
    description: 'Ukrainian (Ukraine)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'ur-IN': {
    code: 'ur-IN',
    description: 'Urdu (India)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'ur-PK': {
    code: 'ur-PK',
    description: 'Urdu (Pakistan)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'uz-UZ': {
    code: 'uz-UZ',
    description: 'Uzbek (Uzbekistan)',
    profanity: false,
    punctuation: false,
    diarization: false
  },
  'vi-VN': {
    code: 'vi-VN',
    description: 'Vietnamese (Vietnam)',
    profanity: false,
    punctuation: false,
    diarization: true
  },
  'zu-ZA': {
    code: 'zu-ZA',
    description: 'Zulu (South Africa)',
    profanity: false,
    punctuation: false,
    diarization: true
  }
}

const LANGUAGE_ARRAY = Object.values(LANGUAGES)

module.exports = {
  LimitError,
  UnauthenticatedError,
  ValidationError,
  FORMATS,
  INTERACTION_TYPE,
  LANGUAGES,
  LANGUAGE_ARRAY,
  MICROPHONE_DISTANCE,
  MODEL,
  ORIGINAL_MEDIA_TYPE,
  RECORDING_TYPE_DEVICE
}
