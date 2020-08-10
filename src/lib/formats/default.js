const { fmtTime } = require('../helpers')
const { needsZeroSub, zeroSub } = require('./helpers')

function encodeResult ({ results }, forceSubAtZero) {
  const { content } = results
    .reduce((acc, curr, i, arr) => {
      const { alternatives } = curr
      if (!Array.isArray(alternatives) || alternatives.length === 0) return acc

      const { transcript, words } = alternatives[0]
      if (!transcript || !Array.isArray(words) || !words[0]) return acc

      let { content, index } = acc

      const firstWord = words[0]
      const lastWord = words[words.length - 1]

      const timeStart = fmtTime(firstWord.startTime)
      const timeEnd = fmtTime(lastWord.endTime)

      // When `forceSubAtZero` is set, we need to prepend an empty sub ranging from 0 to startTime
      // and adjust indezes
      if (needsZeroSub(forceSubAtZero, index, timeStart)) {
        index += 1
        content = `${zeroSub(timeStart)}`
      }

      index += 1
      content = `${content}${index}\n${timeStart} --> ${timeEnd}\n${transcript.trim()}`
      if (i < arr.length - 1) content = `${content}\n\n`

      return { index, content }
    }, { index: 0, content: '' })

  return content
}

function encodeDiarizedResult ({ results }, forceSubAtZero) {
  if (results.length === 0) return ''

  const lastResult = results[results.length - 1]
  const { words } = lastResult.alternatives[0]

  const res = words
    .reduce((acc, curr, i, arr) => {
      let { content, index, sentenceBuffer } = acc
      const { lastTimeEnd, lastSpeakerTag } = acc
      const { speakerTag, word } = curr

      const hasSpeakerChanged = lastSpeakerTag !== speakerTag

      const timeStart = fmtTime(curr.startTime)
      const timeEnd = fmtTime(curr.endTime)

      const isLast = i === arr.length - 1

      if (!hasSpeakerChanged && !isLast) {
        sentenceBuffer.push(word)

        return {
          lastTimeEnd: timeEnd,
          lastSpeakerTag: speakerTag,
          index,
          content,
          sentenceBuffer
        }
      }

      if (needsZeroSub(forceSubAtZero, i, timeStart)) {
        index += 1
        content = `${zeroSub(timeStart)}`
      }

      index += 1
      const passage = sentenceBuffer.join(' ')
      const prevToken = (timestamp) => `${content}${timestamp}\n${passage}`
      const nextToken = `${index}\n${timeStart} --> `

      if (i === 0) {
        content = `${content}${nextToken}`
        if (isLast) content = `${content}${timeEnd}\n[Speaker ${speakerTag}] ${word}`
      } else if (!isLast) {
        content = `${prevToken(lastTimeEnd)}\n\n${nextToken}`
      } else if (!hasSpeakerChanged) {
        content = `${prevToken(timeEnd)} ${word}`
      } else {
        content = `${prevToken(lastTimeEnd)} ${word}`
      }

      return {
        lastTimeEnd: timeEnd,
        lastSpeakerTag: speakerTag,
        index,
        content,
        sentenceBuffer: [`[Speaker ${speakerTag}] ${word}`]
      }
    }, {
      sentenceBuffer: [],
      content: '',
      index: 0,
      lastTimeEnd: null,
      lastSpeakerTag: null
    })

  return res.content
}

module.exports = {
  encodeResult, encodeDiarizedResult
}
