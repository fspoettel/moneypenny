
class ValidationError extends Error {}

const LANGUAGES = [
  {
    code: 'de-DE',
    name: 'Deutsch (Deutschland)'
  },
  {
    code: 'en-US',
    name: 'English (United States)'
  },
  {
    code: 'en-GB',
    name: 'English (United Kingdom)'
  },
  {
    code: 'en-IN',
    name: 'English (India)'
  },
  {
    code: 'es-ES',
    name: 'Spanish (Spain)'
  },
  {
    code: 'fr-FR',
    name: 'French (France)'
  },
  {
    code: 'it-IT',
    name: 'Italian (Italy)'
  },
  {
    code: 'ja-JP',
    name: 'Japanese (Japan)'
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)'
  },
  {
    code: 'ru-RU',
    name: 'Russian (Russia)'
  }
];

const INTERACTION_TYPE = {
  INTERACTION_TYPE_UNSPECIFIED: {
    description: 'Unknown or something other than one of the other values below.',
    key: 'INTERACTION_TYPE_UNSPECIFIED'
  },
  DISCUSSION: {
    description: 'Multiple people in a conversation or discussion in one room. For example in a meeting',
    key: 'DISCUSSION'
  },
  PRESENTATION: {
    description: 'One or more persons lecturing or presenting to others, mostly uninterrupted.',
    key: 'PRESENTATION'
  },
  PHONE_CALL: {
    isDefault: true,
    description: 'A phone-call or video-conference in which two or more people, who are not in the same room, are speaking.',
    key: 'PHONE_CALL'
  },
  VOICEMAIL: {
    description: 'A recorded message intended for another person to listen to.',
    key: 'VOICEMAIL'
  },
  PROFESSIONALLY_PRODUCED: {
    description: 'Professionally produced audio (eg. TV Show, Podcast).',
    key: 'PROFESSIONALLY_PRODUCED'
  },
  VOICE_SEARCH: {
    description: 'Transcribe spoken questions and queries into text.',
    key: 'VOICE_SEARCH'
  },
  VOICE_COMMAND: {
    description: 'Transcribe voice commands, such as for controlling a device.',
    key: 'VOICE_COMMAND'
  },
  DICTATION: {
    description: 'Transcribe speech to text to create a written document, such as a text-message, email or report.',
    key: 'DICTATION'
  },
};

const MICROPHONE_DISTANCE = {
  MICROPHONE_DISTANCE_UNSPECIFIED: {
    description: 'Audio type is not known.',
    key: 'MICROPHONE_DISTANCE_UNSPECIFIED'
  },
  NEARFIELD: {
    isDefault: true,
    description: 'A closely placed microphone. Eg. phone, dictaphone, or handheld microphone. Generally if speaker is within 1 meter of the microphone.',
    key: 'NEARFIELD'
  },
  MIDFIELD: {
    description: 'The speaker is within 3 meters of the microphone.',
    key: 'MIDFIELD'
  },
  FARFIELD: {
    description: 'The speaker is more than 3 meters away from the microphone.',
    key: 'FARFIELD'
  },
};

const ORIGINAL_MEDIA_TYPE = {
  ORIGINAL_MEDIA_TYPE_UNSPECIFIED: {
    description: 'Unknown original media type.',
    key: 'ORIGINAL_MEDIA_TYPE_UNSPECIFIED'
  },
  AUDIO: {
    description: 'The speech data is an audio recording.',
    key: 'AUDIO'
  },
  VIDEO: {
    description: 'The speech data originally recorded on a video.',
    key: 'VIDEO'
  },
};

const RECORDING_TYPE_DEVICE = {
  RECORDING_DEVICE_TYPE_UNSPECIFIED: {
    isDefault: true,
    description: 'The recording device is unknown.',
    key: 'RECORDING_DEVICE_TYPE_UNSPECIFIED'
  },
  SMARTPHONE: {
    description: 'Speech was recorded on a smartphone.',
    key: 'SMARTPHONE'
  },
  PC: {
    description: 'Speech was recorded using a personal computer or tablet.',
    key: 'PC'
  },
  PHONE_LINE: {
    description: 'Speech was recorded over a phone line.',
    key: 'PHONE_LINE'
  },
  VEHICLE: {
    description: 'Speech was recorded in a vehicle.',
    key: 'VEHICLE'
  },
  OTHER_OUTDOOR_DEVICE: {
    description: 'Speech was recorded outdoors.',
    key: 'OTHER_OUTDOOR_DEVICE'
  },
  OTHER_INDOOR_DEVICE: {
    description: 'Speech was recorded indoors.',
    key: 'OTHER_INDOOR_DEVICE'
  },
};

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
  isDefault: {
    isDefault: true,
    description: 'Best for audio that is not one of the specific audio models. For example, long-form audio. Ideally the audio is high-fidelity, recorded at a 16khz or greater sampling rate.',
    key: 'isDefault'
  },
};


module.exports = {
  ValidationError,
  INTERACTION_TYPE,
  LANGUAGES,
  MICROPHONE_DISTANCE,
  MODEL,
  ORIGINAL_MEDIA_TYPE,
  RECORDING_TYPE_DEVICE
};
