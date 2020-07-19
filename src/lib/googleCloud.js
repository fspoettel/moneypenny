const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const { Storage } = require('@google-cloud/storage');
const { PassThrough } = require('stream');

const debug = require('debug')('app:gcs');

const {
  GOOGLE_BUCKET,
  GOOGLE_PROJECT_ID,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY
} = process.env;

const credentials = {
  projectId: GOOGLE_PROJECT_ID,
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
};

const storageClient = new Storage(credentials);
const speechClient = new SpeechClient(credentials);

function removeObject(key) {
  debug(`Removing cloud storage object: ${key}`);
  const bucket = storageClient.bucket(GOOGLE_BUCKET);
  const blob = bucket.file(key);
  return blob.delete(key);
}

function gcsUploadStream(key) {
  const pass = PassThrough();

  const bucket = storageClient.bucket(GOOGLE_BUCKET);
  const blob = bucket.file(key);

  const googleCloudStorageStream = blob.createWriteStream({
    resumable: false,
    validation: false,
    timeout: 1000 * 60 * 60,
  });

  debug(`Starting upload for ${key}`);
  pass.pipe(googleCloudStorageStream);

  const promise = new Promise((resolve, reject) => {
    googleCloudStorageStream.on('error', err => {
      debug(`Upload failed for ${key}`);
      googleCloudStorageStream.end();
      reject(err);
    });

    googleCloudStorageStream.on('finish', () => {
      debug(`Upload finished for ${key}`);
      googleCloudStorageStream.end();
      resolve(blob.name);
    });
  });

  return { writeStream: pass, promise };
}

async function recognize(config) {
  const [operation] = await speechClient.longRunningRecognize(config);
  const [response] = await operation.promise();
  return response;
}

module.exports = {
  gcsUploadStream,
  recognize,
  removeObject
};

