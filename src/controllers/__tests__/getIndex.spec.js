const bcrypt = require('bcrypt')
const request = require('supertest')
const pool = require('../../db/pg')
const { makeApp } = require('../../app')

jest.mock('../../db/pg')

describe('/', () => {
  let app

  beforeEach(() => {
    app = makeApp()
  })

  describe('when the user is not authenticated', () => {
    it('redirects to /login', (done) => {
      request(app)
        .get('/')
        .end((err, res) => {
          if (err) throw new Error(err)
          expect(res.status).toEqual(302)
          expect(res.headers.location).toEqual('/login')
          done()
        })
    })
  })

  describe('when the user is authenticated', () => {
    let cookie

    pool.connect.mockImplementation(async () => {
      const password = await bcrypt.hash('bar', 10)
      return {
        id: 'foo-id',
        username: 'foo',
        password
      }
    })

    beforeEach(async () => {
      await request(app)
        .post('/login?username=foo&password=bar')
        .then((res) => {
          cookie = res.header['set-cookie']
        })
    })

    it('renders page', (done) => {
      request(app)
        .get('/')
        .set('cookie', cookie)
        .end((err, res) => {
          if (err) throw new Error(err)
          expect(res.status).toEqual(200)
          expect(res.header['content-type']).toEqual('text/html; charset=utf-8')
          done()
        })
    })
  })
})
