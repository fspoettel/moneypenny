const path = require('path');
const Busboy = require('busboy');
const FileType = require('file-type');
const { gcsUploadStream } = require('../lib/googleCloud');
const { transcribe } = require('../lib/transcribe');
const { flacEncoder } = require('../lib/ffmpeg');
const { ValidationError, ORIGINAL_MEDIA_TYPE } = require('../constants');

const debug = require('debug')('server');

const postTranscribe = (req, res, next) => {
  let busboy;
  let hasFile = false;

  try {
    busboy = new Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: 500 * 1024 * 1024 }
    });
  } catch (err) {
    return next(err)
  }

  const params = {};
  const upload = { basename: null, promise: null };

  busboy.on('field', (fieldname, value) => {
    switch (fieldname) {
      case 'speaker_count':
        params.speakerCount = Number.parseInt(value, 10);
        break;
      case 'language_code':
        params.languageCode = value;
        break;
      case 'model':
        params.model = value;
        break;
      case 'microphone_distance':
        params.microphoneDistance = value;
        break;
      case 'profanity_filter':
        params.profanityFilter = value === 'on';
        break;
      case 'punctuation':
        params.punctuation = value === 'on';
        break;
      case 'interaction_type':
        params.interactionType = value;
        break;
      case 'industry_code':
        params.industryNaicsCodeOfAudio = value || undefined;
        break;
      case 'recording_device_type':
        params.recordingDeviceType = value;
        break;
      default:
        break;
    }
  });

  busboy.on('file', async (fieldname, file, filename) => {
    hasFile = true;
    let fileStream;

    try {
      fileStream = await FileType.stream(file);
    } catch (err) {
      return file.resume();
    }

    const { fileType } = fileStream;

    if (!fileType.mime.startsWith('audio') && !fileType.mime.startsWith('video')) {
      return file.resume();
    }

    params.originalMediaType = fileType.mime.startsWith('audio')
      ? ORIGINAL_MEDIA_TYPE.AUDIO.key
      : ORIGINAL_MEDIA_TYPE.VIDEO.key;

    params.originalMimeType = fileType.mime;

    upload.originalname = path.basename(filename, path.extname(filename));
    upload.basename = `${Date.now()}-${upload.originalname}`;
    const { writeStream, promise } = gcsUploadStream(`${upload.basename}.flac`);
    upload.promise = promise;

    debug(`Starting upload for file: ${upload.basename}`);
    flacEncoder(fileStream).pipe(writeStream);
  });

  const onError = (err) => {
    req.unpipe(busboy);
    busboy.removeAllListeners();
    return next(err);
  };

  busboy.on('finish', async () => {
    if (!hasFile) {
      return onError(new ValidationError('No file to transcribe'));
    }

    if (upload.basename == null) {
      return onError(new ValidationError('Error while processing file.'));
    }

    try {
      const gcsUri = await upload.promise;
      debug(`Finished upload for file: ${gcsUri}`);

      const transcript = await transcribe(gcsUri, params);
      res.set('Content-Type', 'text/plain');
      res.set('Content-Disposition', `attachment; filename=${upload.originalname}.txt`);
      res.status(200).send(transcript);
    } catch (err) {
      return onError(err);
    }
  });

  req.pipe(busboy);
};

module.exports = postTranscribe;
