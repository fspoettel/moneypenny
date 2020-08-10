const Sentry = require('@sentry/node')
const errorHandler = require('../errorHandler')
const { ValidationError, LimitError, UnauthenticatedError } = require('../../../constants')

jest.mock('@sentry/node', () => ({
  captureException: jest.fn()
}))

const mockRes = {
  status: jest.fn(),
  json: jest.fn()
}

describe('errorHandler()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sends unknown errors to Sentry', () => {
    const err = new Error('unknown')
    errorHandler(err, {}, mockRes)
    expect(Sentry.captureException).toHaveBeenCalledWith(err)
  })

  it('answers with a 500 "Internal server error" for unknown errors', () => {
    errorHandler(new Error(), {}, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('answers with a 400 error for ValidationErrors', () => {
    errorHandler(new ValidationError('foo'), {}, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'foo' })
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('answers with a 413 error for LimitErrors', () => {
    errorHandler(new LimitError('bar'), {}, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(413)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'bar' })
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('answers with a 401 error for UnauthenticatedErrors', () => {
    errorHandler(new UnauthenticatedError('baz'), {}, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'baz' })
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })
})
