const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { sql } = require('slonik')
const pool = require('../../db/pg')

function selectUserByEmail (email) {
  return pool.connect((conn) => conn.maybeOne(
    // for those wondering whether this is safe:
    // tagged sql``  templates guard against SQL injections
    sql`
      SELECT *
      FROM member
      WHERE email=${email}
      LIMIT 1
    `
  ))
}

function selectUserById (id) {
  return pool.connect((conn) => conn.one(
    sql`
      SELECT email, id
      FROM member
      WHERE id=${id}
      LIMIT 1
    `
  ))
}

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await selectUserByEmail(username)
      if (!user) return done(null, false)

      const match = await bcrypt.compare(password, user.password)
      if (!match) return done(null, false)

      const sessionUser = { ...user }
      delete sessionUser.password
      return done(null, sessionUser)
    } catch (err) {
      return done(err)
    }
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  try {
    const user = await selectUserById(id)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
})

module.exports = [
  passport.initialize(),
  passport.session()
]
