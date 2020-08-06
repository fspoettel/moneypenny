const { createPool } = require('slonik')

const pool = createPool(process.env.DATABASE_URL)
module.exports = pool
