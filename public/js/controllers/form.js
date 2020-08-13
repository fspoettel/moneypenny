import { postTranscribe } from '../services/transcribe.js'

const { Stimulus } = window

export function isFileTooLarge (file, limitMb) {
  if (!file || !file.size) return false
  const size = (file.size / 1024 / 1024).toFixed(4) // MB
  return size > Number.parseInt(limitMb, 10)
}

function parseFilenameFromResponse (response) {
  const contentDisposition = response.headers.get('Content-Disposition')
  const parsedFileName = /.*;filename\*=utf-8''(.*)$/.exec(contentDisposition)
  const fileName = (parsedFileName && parsedFileName[1]) || 'transcript.txt'
  return decodeURIComponent(fileName)
}

function parseErrorFromResponse (err) {
  let errMessage = 'Internal Server Error'

  if (err.message && err.message.includes('NetworkError')) {
    errMessage = 'File is too large'
  } else if (err.message) {
    errMessage = err.message
  }

  return errMessage
}

function readBlobAsString (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => resolve(fileReader.result))
    fileReader.addEventListener('abort', reject)
    fileReader.addEventListener('error', reject)
    fileReader.readAsText(blob, 'utf-8')
  })
}

export default function makeFormController (application) {
  application.register('form', class extends Stimulus.Controller {
    static get targets () {
      return [
        'error',
        'file',
        'fileLabel',
        'submit',
        'spinner'
      ]
    }

    connect () {
      this.resetForm()
    }

    onFileChange (evt) {
      this.hideError()
      this.setSubmitEnabled()
      this.setFileLabel(evt.target.files[0].name)
    }

    async onFormSubmit (evt) {
      evt.preventDefault()

      this.showSpinner()
      this.setSubmitDisabled()
      this.hideError()

      try {
        const file = this.fileTarget.files[0]
        const limit = this.data.get('limit')
        if (isFileTooLarge(file, limit)) {
          throw new TypeError('NetworkError: File too large')
        }

        const response = await postTranscribe(new FormData(this.element))
        await this.dispatchFinishEvent(response)
        this.resetForm()
      } catch (err) {
        const message = await parseErrorFromResponse(err)
        this.showError(message)
        this.setSubmitEnabled()
      } finally {
        this.hideSpinner()
      }
    }

    async dispatchFinishEvent (response) {
      const event = document.createEvent('CustomEvent')
      const blob = await response.blob()

      const content = await readBlobAsString(blob)

      const name = parseFilenameFromResponse(response)
      const createdOn = Date.now()

      event.initCustomEvent('form-finish', true, true, {
        name,
        createdOn,
        content,
        key: `mp-${createdOn}`
      })

      this.element.dispatchEvent(event)
    }

    resetForm () {
      const fileLabel = this.data.get('fileLabel')
      if (fileLabel) this.setFileLabel(fileLabel)
      this.setSubmitDisabled()
      this.element.reset()
    }

    setSubmitDisabled () {
      this.submitTarget.setAttribute('disabled', '')
    }

    setSubmitEnabled () {
      this.submitTarget.removeAttribute('disabled')
    }

    setFileLabel (str) {
      if (!this.data.has('fileLabel')) {
        this.data.set('fileLabel', this.fileLabelTarget.innerHTML)
      }

      this.fileLabelTarget.innerHTML = str
    }

    showSpinner () {
      this.spinnerTarget.classList.add('is-active')
    }

    hideSpinner () {
      this.spinnerTarget.classList.remove('is-active')
    }

    showError (str) {
      this.errorTarget.classList.add('active')
      this.errorTarget.innerHTML = `Error: ${str}`
    }

    hideError () {
      this.errorTarget.classList.remove('active')
      this.errorTarget.innerHTML = ''
    }
  })
}
