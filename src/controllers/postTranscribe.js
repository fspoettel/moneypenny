const fs = require('fs');
const path = require('path');
const os = require('os');
const Busboy = require('busboy');
const FileType = require('file-type');
const { gcsUploadStream, removeObject } = require('../lib/googleCloud');
const { transcribe } = require('../lib/transcribe');
const { flacEncoder } = require('../lib/ffmpeg');
const { writeTempFile, removeTempFile } = require('../lib/disk');
const { ValidationError, ORIGINAL_MEDIA_TYPE, LimitError } = require('../constants');

const debug = require('debug')('app:server');

const tmp = os.tmpdir();
const { UPLOAD_LIMIT_MB } = process.env;

const postTranscribe = (req, res, next) => {
  let busboy;

  try {
    busboy = new Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: UPLOAD_LIMIT_MB * 1024 * 1024 }
    });
  } catch (err) {
    return next(err)
  }

  const onError = (err) => {
    debug(`Sending error response`);
    req.unpipe(busboy);
    next(err);
    if (tmpPath) removeTempFile(tmpPath);
  };

  const params = {};

  let hasFile = false;
  let basename;
  let originalName;
  let tmpPath;
  let uploadPromise;

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
    let fileStream;
    hasFile = true;

    try {
      fileStream = await FileType.stream(file);
      fileStream.on('close', () => { debug(`Closing file stream`); });
    } catch (err) {
      return file.resume();
    }

    const { fileType } = fileStream;
    if (!fileType.mime.startsWith('audio') && !fileType.mime.startsWith('video')) {
      return file.resume();
    }

    originalName = path.basename(filename, path.extname(filename));
    basename = `${Date.now()}-${originalName}`;
    tmpPath = path.join(tmp, `${basename}.${fileType.ext}`);

    debug(`Starting upload for file: ${basename}`);

    params.originalMimeType = fileType.mime;
    params.originalMediaType = fileType.mime.startsWith('audio')
      ? ORIGINAL_MEDIA_TYPE.AUDIO.key
      : ORIGINAL_MEDIA_TYPE.VIDEO.key;

    const { writeStream, promise } = writeTempFile(tmpPath);
    uploadPromise = promise;

    file.on('limit', () => {
      debug(`File too large: ${tmpPath}`);
      res.header('Connection', 'Close');
      fileStream.unpipe(writeStream);
      fileStream.end();
      writeStream.end();
      onError(new LimitError('File is too large'));
    });

    fileStream.pipe(writeStream);
  });

  busboy.on('finish', async () => {
    debug(`Finished parsing form data`);

    if (!hasFile) return onError(new ValidationError('No file to transcribe'));
    if (uploadPromise == null) return onError(new ValidationError('Error while processing file.'));

    try {
      await uploadPromise;
    } catch (err) {
      return onError(err);
    }

    const { writeStream, promise: gcsPromise } = gcsUploadStream(`${basename}.flac`);
    debug(`Starting encode and upload to GCS for ${basename}`);
    const readStream = fs.createReadStream(tmpPath);
    flacEncoder(readStream).pipe(writeStream);

    try {
      const gcsUri = await gcsPromise;

      const [transcript] = await Promise.all([
        transcribe(gcsUri, params),
        removeTempFile(tmpPath)
      ]);

      await removeObject(`${basename}.flac`);

      debug(`Sending transcript with ${transcript.length} characters`);
      res.set('Content-Type', 'text/plain');
      res.set('Content-Disposition', `attachment; filename=${originalName}.txt`);
      res.status(200).send(transcript);
    } catch (err) {
      return onError(err);
    }
  });

  req.pipe(busboy);
};

module.exports = postTranscribe;
