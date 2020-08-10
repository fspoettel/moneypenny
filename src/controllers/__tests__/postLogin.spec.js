const bcrypt = require('bcrypt')
const request = require('supertest')
const pool = require('../../db/pg')
const { makeApp } = require('../../app')

jest.mock('../../db/pg')

describe('POST /login', () => {
  let app

  beforeEach(() => {
    app = makeApp()
  })

  describe('when login fails', () => {
    beforeEach(() => {
      pool.connect.mockImplementationOnce(async () => null)
    })

    it('redirects to /login', (done) => {
      request(app)
        .post('/login?username=foo&password=bar')
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toEqual(302)
          expect(res.header.location).toEqual('/login')
          done()
        })
    })
  })

  describe('when login is succesful', () => {
    beforeEach(() => {
      pool.connect.mockImplementationOnce(async () => {
        const password = await bcrypt.hash('bar', 10)
        return {
          id: 'foo-id',
          username: 'foo',
          password
        }
      })
    })

    it('redirects to /', (done) => {
      request(app)
        .post('/login?username=foo&password=bar')
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toEqual(302)
          expect(res.header.location).toEqual('/')
          done()
        })
    })
  })
})
