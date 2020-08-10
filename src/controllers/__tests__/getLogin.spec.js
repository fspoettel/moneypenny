const { makeApp } = require('../../app')
const request = require('supertest')

describe('GET /login', () => {
  let app

  beforeEach(() => {
    app = makeApp()
  })

  it('renders the /login page', (done) => {
    request(app)
      .get('/login')
      .end((err, res) => {
        if (err) throw new Error(err)
        expect(res.status).toEqual(200)
        expect(res.header['content-type']).toEqual('text/html; charset=utf-8')
        done()
      })
  })
})
