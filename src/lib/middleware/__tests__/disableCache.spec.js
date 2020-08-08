const disableCache = require('../disableCache')

const mockRes = { set: jest.fn() }
const mockNext = jest.fn()

describe('disableCache()', () => {
  it('sets Cache-Control header to `no-store`', () => {
    disableCache({}, mockRes, mockNext)
    expect(mockNext).toBeCalledWith()
    expect(mockRes.set).toBeCalledWith('Cache-Control', 'no-store')
  })
})
