const {
  ensureLogin,
  ensureLoginApi
} = require('../ensureLogin')
const { UnauthenticatedError } = require('../../../constants')

const mockReq = {
  isAuthenticated: jest.fn(() => true)
}

const mockRes = {
  redirect: jest.fn()
}

const mockNext = jest.fn()

describe('ensureLogin()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls next() if request is authenticated', () => {
    ensureLogin(mockReq, mockRes, mockNext)
    expect(mockNext).toBeCalledWith()
  })

  it('redirects to /login if request is not authenticated', () => {
    mockReq.isAuthenticated.mockImplementationOnce(() => false)
    ensureLogin(mockReq, mockRes, mockNext)
    expect(mockNext).not.toBeCalled()
    expect(mockRes.redirect).toBeCalledWith('/login')
  })
})

describe('ensureLoginApi()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls next() if request is authenticated', () => {
    ensureLoginApi(mockReq, mockRes, mockNext)
    expect(mockNext).toBeCalledWith()
  })

  it('calls next() with error if request is not authenticated', () => {
    mockReq.isAuthenticated.mockImplementationOnce(() => false)
    ensureLoginApi(mockReq, mockRes, mockNext)
    expect(mockNext).toBeCalled()
    expect(mockNext.mock.calls[0][0]).toBeInstanceOf(UnauthenticatedError)
  })
})
