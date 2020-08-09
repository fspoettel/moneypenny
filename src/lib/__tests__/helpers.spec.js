const { fmtTime, getDefaultValue, normalizeEmail } = require('../helpers')
const { MICROPHONE_DISTANCE } = require('../../constants')

describe('fmtTime()', () => {
  it('formats null-ish values', () => {
    expect(fmtTime(null)).toEqual('00:00:00,000')
  })

  it('formats values in the seconds range', () => {
    expect(fmtTime({ seconds: 50, nanos: 100 * 1e+6 }))
      .toEqual('00:00:50,100')
  })

  it('formats values in the minutes range', () => {
    expect(fmtTime({ seconds: 1820, nanos: 300 * 1e+6 }))
      .toEqual('00:30:20,300')
  })

  it('formats values in the hours range', () => {
    expect(fmtTime({ seconds: 65 * 60 + 45, nanos: 400 * 1e+6 }))
      .toEqual('01:05:45,400')
  })
})

describe('normalizeEmail()', () => {
  it('lowercases emails', () => {
    expect(normalizeEmail('Felix@cyber.space')).toEqual('felix@cyber.space')
  })

  it('trims whitespace in email', () => {
    expect(normalizeEmail('  felix@cyber.space ')).toEqual('felix@cyber.space')
  })
})

describe('getDefaultValue()', () => {
  it('returns default value for a constant array', () => {
    expect(getDefaultValue(MICROPHONE_DISTANCE)).toEqual('NEARFIELD')
  })
})
