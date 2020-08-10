const { fmtTime } = require('../helpers')
const { needsZeroSub, zeroSub } = require('./helpers')

function encodeResult ({ results }, forceSubAtZero) {
  const allWords = results
    .reduce((acc, curr) => {
      const { alternatives } = curr
      if (!Array.isArray(alternatives) || alternatives.length === 0) return acc

      const { words } = alternatives[0]
      if (!Array.isArray(words) || !words[0]) return acc

      return [...acc, ...words]
    }, [])

  const res = allWords
    .reduce((acc, curr, i, arr) => {
      let { sentenceBuffer, content, index } = acc

      const timeStart = fmtTime(curr.startTime)
      const timeEnd = fmtTime(curr.endTime)

      const isEnd = /\.|\?|!/.test(curr.word)
      const isLast = i === arr.length - 1

      if (needsZeroSub(forceSubAtZero, index, timeStart)) {
        index += 1
        content = `${zeroSub(timeStart)}`
      }

      if (sentenceBuffer.length === 0) {
        index += 1
        content = `${content}${index}\n${timeStart}`
      }

      sentenceBuffer.push(curr.word)

      if (isEnd || isLast) {
        content = `${content} --> ${timeEnd}\n${sentenceBuffer.join(' ')}`
        if (!isLast) content = `${content}\n\n`
        sentenceBuffer = []
      }

      return { content, index, sentenceBuffer }
    }, {
      sentenceBuffer: [],
      content: '',
      index: 0
    })

  return res.content
}

function encodeDiarizedResult ({ results }, forceSubAtZero) {
  if (results.length === 0) return ''

  const lastResult = results[results.length - 1]
  const { words } = lastResult.alternatives[0]

  const { bySpeaker } = words
    .reduce((acc, curr) => {
      const { bySpeaker, lastSpeakerTag } = acc

      const speakerTag = curr.speakerTag
      const hasSpeakerChanged = lastSpeakerTag !== speakerTag

      if (!hasSpeakerChanged) {
        bySpeaker[bySpeaker.length - 1].push(curr)
        return acc
      }

      bySpeaker.push([curr])
      return { lastSpeakerTag: speakerTag, bySpeaker }
    }, {
      lastSpeakerTag: null,
      bySpeaker: []
    })

  const res = bySpeaker
    .reduce((acc, curr, i, sentenceArr) => {
      if (curr.length === 0) return acc

      let { content, index } = acc
      let sentenceBuffer = []

      const currentSpeaker = curr[0].speakerTag
      const isLastSentence = i === sentenceArr.length - 1

      curr.forEach(({ word, startTime, endTime }, j) => {
        const timeStart = fmtTime(startTime)
        const isNewSentence = sentenceBuffer.length === 0
        const isLastWord = j === curr.length - 1
        const isEnd = /\.|\?|!/.test(word)

        sentenceBuffer.push(word)

        if (needsZeroSub(forceSubAtZero, i + j, timeStart)) {
          index += 1
          content = `${zeroSub(timeStart)}`
        }

        if (isNewSentence && !isLastWord) {
          index += 1
          content = `${content}${index}\n${timeStart} --> `
        } else if (isEnd || isLastWord) {
          if (isNewSentence) {
            index += 1
            content = `${content}${index}\n${timeStart} --> `
          }
          content = `${content}${fmtTime(endTime)}\n[Speaker ${currentSpeaker}] ${sentenceBuffer.join(' ')}`
          if (!isLastSentence || !isLastWord) content = `${content}\n\n`
          sentenceBuffer = []
        }
      })

      return { content, index }
    }, { content: '', index: 0 })

  return res.content
}

module.exports = {
  encodeResult, encodeDiarizedResult
}
