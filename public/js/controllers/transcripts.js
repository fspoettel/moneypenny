import { downloadString, createDownloadUrlFromString } from '../lib/download.js'

const { Stimulus } = window

function formatDate (date) {
  return new Intl.DateTimeFormat(window.locale).format(date)
}

function playSoundClip () {
  try {
    const audio = new Audio('/static/yougotmail.mp3')
    audio.preload = true
    audio.volume = 0.25
    if (audio) audio.play()
  } catch (err) {
    console.error(err)
  }
}

export default function makeTranscriptsController (application) {
  application.register('transcripts', class extends Stimulus.Controller {
    static get targets () {
      return [
        'list',
        'transcript',
        'placeholder',
        'spinner'
      ]
    }

    connect () {
      const transcripts = this.getTranscripts()

      if (transcripts.length === 0) {
        this.showPlaceholder()
      } else {
        transcripts.forEach(this.appendTranscript.bind(this))
        this.showList()
      }
    }

    getTranscripts () {
      if (!localStorage || localStorage.length === 0) return []

      const transcripts = []

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)

        if (key.startsWith('mp-')) {
          let item

          try {
            item = JSON.parse(localStorage.getItem(key))
          } catch (err) {
            localStorage.removeItem(key)
          }

          transcripts.push(item)
        }
      }

      return transcripts
    }

    appendTranscript (transcript) {
      const { content, key, name, createdOn } = transcript
      const template = document.createElement('template')
      template.innerHTML = `
        <li class="transcript" data-key="${key}">
          <span class="transcript-time">${formatDate(createdOn)}</span>
          <span class="transcript-content">${name}</span>
          <div class="transcript-actions">
            <a class="button" download="${name}" href="${createDownloadUrlFromString(content)}" target="_blank">Download</a>
            <button class="button_nude" data-action="transcripts#onDelete">Delete</button>
          </div>
        </li>
      `.trim()

      this.listTarget.append(template.content.childNodes[0])
    }

    showList () {
      this.hidePlaceholder()
      this.hideSpinner()
      this.listTarget.classList.add('active')
    }

    hideList () {
      this.listTarget.classList.remove('active')
    }

    showPlaceholder () {
      this.hideList()
      this.hideSpinner()
      this.placeholderTarget.classList.add('active')
    }

    hidePlaceholder () {
      this.placeholderTarget.classList.remove('active')
    }

    hideSpinner () {
      this.spinnerTarget.classList.remove('active')
    }

    onDelete (evt) {
      const row = evt.target.closest('.transcript')
      const { key } = row.dataset

      const list = this.listTarget
      list.removeChild(row)

      localStorage.removeItem(key)

      if (list.childNodes.length === 0) {
        this.showPlaceholder()
        this.hideList()
      }
    }

    async onNewTranscript ({ detail }) {
      await downloadString(detail.content, detail.name)
      localStorage.setItem(detail.key, JSON.stringify(detail))
      this.appendTranscript(detail)
      this.showList()
      playSoundClip()
    }
  })
}
