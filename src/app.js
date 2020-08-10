const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const connectRedis = require('connect-redis')
const helmet = require('helmet')
const nunjucks = require('nunjucks')

const getIndex = require('./controllers/getIndex')
const getLogin = require('./controllers/getLogin')
const postLogin = require('./controllers/postLogin')
const postTranscribe = require('./controllers/postTranscribe')

const redisClient = require('./db/redis')

const errorHandler = require('./lib/middleware/errorHandler')
const disableCache = require('./lib/middleware/disableCache')
const { ensureLogin, ensureLoginApi } = require('./lib/middleware/ensureLogin')
const { middlewares: authMiddlewares } = require('./lib/middleware/auth')

const { NODE_ENV, PORT, SESSION_SECRET } = process.env

function makeApp () {
  const app = express()
  app.set('port', PORT || 3000)
  app.set('etag', false)
  app.set('trust proxy', true)

  nunjucks.configure('views', {
    autoescape: true,
    express: app
  })

  app.use('/static', express.static('public'))

  app.use(bodyParser.urlencoded({ extended: false }))

  const RedisStore = connectRedis(session)
  app.use(session({
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: NODE_ENV === 'production'
    },
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: new RedisStore({ client: redisClient })
  }))

  app.use(helmet())
  app.use(disableCache)

  app.use(authMiddlewares)

  app.get('/login', getLogin)
  app.post('/login', postLogin)

  app.get('/', ensureLogin, getIndex)
  app.post('/transcribe', ensureLoginApi, postTranscribe)

  app.use(errorHandler)

  return app
}

module.exports = { makeApp }
