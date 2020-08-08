const { PassThrough } = require('stream')
const { removeObject, gcsUploadStream, recognize } = require('../googleCloud')

let mockGcsStream

const mockBlob = {
  createWriteStream: jest.fn(() => mockGcsStream),
  delete: jest.fn(() => Promise.resolve()),
  name: 'foo'
}

const mockBucket = {
  file: jest.fn(() => mockBlob)
}

jest.mock('@google-cloud/storage', () => ({
  Storage: class Storage {
    bucket () { return mockBucket }
  }
}))

const mockOperation = {
  promise: jest.fn(() => Promise.resolve(['mock-response']))
}

jest.mock('@google-cloud/speech', () => ({
  v1p1beta1: {
    SpeechClient: class SpeechClient {
      longRunningRecognize () {
        return [mockOperation]
      }
    }
  }
}))

describe('removeObject()', () => {
  beforeEach(() => {
    mockGcsStream = new PassThrough()
    jest.clearAllMocks()
  })

  it('removes key from Google Cloud Storage', async () => {
    await removeObject('sample-key')
    expect(mockBucket.file).toHaveBeenCalledWith('sample-key')
    expect(mockBlob.delete).toHaveBeenCalledWith()
  })
})

describe('gcsUploadStream()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a write stream to upload to Google Cloud Storage', () => {
    const gcsUpload = gcsUploadStream('sample-key')
    expect(gcsUpload.writeStream).toBeInstanceOf(PassThrough)
    expect(gcsUpload.promise).toBeInstanceOf(Promise)
  })

  it('pipes data written to write stream to Google Cloud Storage', () => {
    const gcsUpload = gcsUploadStream('sample-key')
    gcsUpload.writeStream.write(Buffer.from('foo-buf'))
    expect(mockGcsStream._readableState.buffer).toHaveLength(1)
  })

  it('resolves the upload promise once the upload finishes', () => {
    const gcsUpload = gcsUploadStream('sample-key')
    mockGcsStream.emit('finish')
    return expect(gcsUpload.promise).resolves.toEqual('foo')
  })

  it('rejects the upload promise if upload stream emits error', () => {
    const err = new Error('foo-error')
    const gcsUpload = gcsUploadStream('sample-key')
    mockGcsStream.emit('error', err)
    return expect(gcsUpload.promise).rejects.toEqual(err)
  })
})

describe('recognize()', () => {
  it('resolves a speechClient operation', async () => {
    const res = await recognize('foo-config')
    expect(mockOperation.promise).toHaveBeenCalled()
    expect(res).toEqual('mock-response')
  })
})
