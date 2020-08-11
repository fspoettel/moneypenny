import { isFileTooLarge } from './lib/helpers.js'
import { postTranscribe } from './services/transcribe.js'
import { download } from './lib/download.js'

const { Stimulus } = window

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
        await this.playSoundClip()
        // TODO: this might fail, add manual way to download
        await download(response)
        this.resetForm()
      } catch (err) {
        const message = await this.parseError(err)
        this.showError(message)
      } finally {
        this.hideSpinner()
        this.setSubmitEnabled()
      }
    }

    async parseError (err) {
      let errMessage = 'Internal Server Error'

      if (err.message && err.message.includes('NetworkError')) {
        errMessage = 'File is too large'
      } else if (err.json) {
        try {
          const body = await err.json()
          errMessage = body.message
        } catch (err) { /**/ }
      } else if (err.message) {
        errMessage = err.message
      }

      return errMessage
    }

    playSoundClip () {
      try {
        const audio = new Audio('/static/yougotmail.mp3')
        audio.preload = true
        audio.volume = 0.25
        if (audio) audio.play()
      } catch (err) {
        console.error(err)
      }
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
