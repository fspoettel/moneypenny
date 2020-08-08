function fmtTime (googleTime) {
  const padZero = (str, num = 2) => `${str}`.padStart(num, '0')

  if (!googleTime) return '00:00:00,000'

  const { seconds, nanos } = googleTime
  const millis = (seconds * 1000) + ((nanos ?? 0) / 1e+6)

  const s = Math.floor((millis / 1000) % 60)
  const m = Math.floor(((millis / 1000) % 3600) / 60)
  const h = Math.floor(millis / 1000 / 3600)
  const ms = millis % 1000

  return `${padZero(h)}:${padZero(m)}:${padZero(s)},${padZero(ms, 3)}`
}

function getDefaultValue (obj) {
  const value = Object.values(obj).find(x => x.default)
  return value ? value.key : null
}

function normalizeEmail (str) {
  return str.trim().toLowerCase()
}

const asyncHandler = (callback) =>
  (req, res, next) => {
    callback(req, res, next).catch(next)
  }

module.exports = {
  asyncHandler,
  fmtTime,
  getDefaultValue,
  normalizeEmail
}
