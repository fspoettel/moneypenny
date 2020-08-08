const { fmtTime } = require('../helpers')

function encodeResult ({ results }) {
  return results
    .reduce((acc, curr, index) => {
      const { alternatives } = curr
      if (!Array.isArray(alternatives) || alternatives.length === 0) return acc

      const { transcript, words } = alternatives[0]
      if (!transcript || !Array.isArray(words) || !words[0]) return acc

      const firstWord = words[0]
      const lastWord = words[words.length - 1]

      const timeStart = fmtTime(firstWord?.startTime)
      const timeEnd = fmtTime(lastWord?.endTime)

      const passage = `${index + 1}\n${timeStart} --> ${timeEnd}\n${transcript.trim()}`
      return acc ? `${acc}\n\n${passage}` : passage
    }, '')
}

function encodeDiarizedResult ({ results }) {
  const lastResult = results[results.length - 1]
  const { words } = lastResult.alternatives[0]

  const res = words
    .reduce((acc, curr, i, arr) => {
      const {
        content,
        index,
        lastEndTime,
        lastSpeakerTag,
        passage
      } = acc
      const { speakerTag, word } = curr

      const hasSpeakerChanged = lastSpeakerTag !== speakerTag

      const nextAcc = {
        lastEndTime: curr.endTime,
        lastSpeakerTag: speakerTag
      }

      if (!hasSpeakerChanged) {
        return {
          ...nextAcc,
          index: index,
          content: content,
          passage: `${passage} ${word}`
        }
      }

      const prevToken = `${content}${fmtTime(lastEndTime)}\n${passage}`
      const nextToken = `${index}\n${fmtTime(curr.startTime)} --> `

      let nextContent

      if (i === 0) {
        nextContent = nextToken
      } else if (i === arr.length - 1) {
        nextContent = prevToken
      } else {
        nextContent = `${prevToken}\n\n${nextToken}`
      }

      return {
        ...nextAcc,
        index: index + 1,
        content: nextContent,
        passage: `[Speaker ${speakerTag}] ${word}`
      }
    }, {
      passage: '',
      content: '',
      index: 1,
      lastEndTime: null,
      lastSpeakerTag: null
    })

  return res.content
}

module.exports = {
  encodeResult, encodeDiarizedResult
}
