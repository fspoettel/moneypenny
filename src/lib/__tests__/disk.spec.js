const fs = require('fs')
const { PassThrough } = require('stream')
const { removeTempFile, writeTempFile } = require('../disk')

let mockWriteStream = new PassThrough()

jest.mock('fs', () => ({
  createWriteStream: jest.fn(() => mockWriteStream),
  promises: {
    unlink: jest.fn(() => Promise.resolve())
  }
}))

describe('disk', () => {
  beforeEach(() => {
    mockWriteStream = new PassThrough()
  })

  describe('removeTempFile()', () => {
    it('resolves after the unlink succeeds', async () => {
      expect(removeTempFile('foo')).resolves.toBeUndefined()
    })

    it('resolves after the unlink succeeds', async () => {
      fs.promises.unlink.mockImplementationOnce(() => Promise.reject(new Error()))
      expect(removeTempFile('foo')).resolves.toBeUndefined()
    })
  })

  describe('writeTempFile()', () => {
    it('returns a writable stream', () => {
      const result = writeTempFile('foo')
      expect(result.writeStream).toBeInstanceOf(PassThrough)
    })

    it('returns a promise that resolves after the write finishes', async () => {
      const result = writeTempFile('foo')
      mockWriteStream.emit('finish')
      expect(result.promise).resolves.toBeUndefined()
    })

    it('returns a promise that rejects if the write errors', () => {
      const result = writeTempFile('foo')
      const mockError = new Error('')
      mockWriteStream.emit('error', mockError)
      expect(result.promise).rejects.toEqual(mockError)
    })
  })
})
