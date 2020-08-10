const bcrypt = require('bcrypt')
const pool = require('../../../db/pg')
const { verifyUser } = require('../auth')

jest.mock('../../../db/pg')

describe('verifyUser ()', () => {
  describe('when the user for email does not exist', () => {
    beforeEach(() => {
      pool.connect.mockImplementationOnce(() => Promise.resolve(null))
    })

    it('does not grant the user access', async () => {
      const cb = jest.fn()
      await verifyUser('foo', 'bar', cb)
      expect(cb).toBeCalledWith(null, false)
    })
  })

  describe('when the password is wrong', () => {
    beforeEach(() => {
      pool.connect.mockImplementationOnce(() => Promise.resolve({
        password: 'bar'
      }))
    })

    it('does not grant the user access', async () => {
      const cb = jest.fn()
      await verifyUser('foo', 'bar', cb)
      expect(cb).toBeCalledWith(null, false)
    })
  })

  describe('when credentials are correct', () => {
    let user

    beforeEach(async () => {
      user = {
        id: 'foo-id',
        username: 'foo',
        password: await bcrypt.hash('bar', 10)
      }

      pool.connect.mockImplementationOnce(() => Promise.resolve(user))
    })

    it('grants the user access', async () => {
      const cb = jest.fn()
      await verifyUser('foo', 'bar', cb)
      expect(cb).toBeCalledWith(null, {
        id: 'foo-id',
        username: 'foo'
      })
    })
  })

  describe('when the db query throws an error', () => {
    const mockError = new Error('')

    beforeEach(() => {
      pool.connect.mockImplementationOnce(() => Promise.reject(mockError))
    })

    it('propagates the error', async () => {
      const cb = jest.fn()
      await verifyUser('foo', 'bar', cb)
      expect(cb).toBeCalledWith(mockError)
    })
  })
})
