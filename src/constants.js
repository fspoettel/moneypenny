
class ValidationError extends Error {}

class LimitError extends Error {}

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
  },
};

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
  },
};

const ORIGINAL_MEDIA_TYPE = {
  ORIGINAL_MEDIA_TYPE_UNSPECIFIED: {
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
  },
};

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
  LimitError,
  INTERACTION_TYPE,
  LANGUAGES,
  MICROPHONE_DISTANCE,
  MODEL,
  ORIGINAL_MEDIA_TYPE,
  RECORDING_TYPE_DEVICE
};
