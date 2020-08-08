require('dotenv').config()
const { sql } = require('slonik')
const bcrypt = require('bcrypt')
const minimist = require('minimist')
const pool = require('../src/db/pg')

const { normalizeEmail } = require('../src/lib/helpers');
(async () => {
  const argv = minimist(process.argv.slice(2))

  const { email, password } = argv

  if (!email || !password) {
    throw new Error('Missing required argument')
  }

  const hash = await bcrypt.hash(password, 10)

  try {
    await pool.connect((connection) => {
      return connection.query(
        sql`
          INSERT INTO member (email, password)
          VALUES (${normalizeEmail(email)}, ${hash})
        `
      )
    })

    console.log(`Inserted user ${email} into database`)
  } catch (err) {
    console.error(`Error inserting user into database: ${err.message}`)
  }
})()
