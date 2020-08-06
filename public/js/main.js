// should work without JS, progressive enhancement only
import { ready, isFileTooLarge } from './lib/helpers.js'
import { download } from './lib/download.js'
import { postTranscribe } from './services/transcribe.js'

class FormController {
  constructor () {
    this.el = new Map()
    this.originalFileLabel = ''
  }

  init () {
    const form = document.querySelector('#transcribe-form')

    if (form) {
      const file = document.querySelector('#file')

      this.el.set('form', form)
      this.el.set('submit', document.querySelector('#submit-btn'))
      this.el.set('spinner', document.querySelector('.spinner'))
      this.el.set('file', file)
      this.el.set('fileLabel', document.querySelector('#file-label'))
      this.el.set('output', document.querySelector('.form-output'))
      this.el.set('outputError', document.querySelector('.form-output .error'))

      file.addEventListener('change', this.onFileChange.bind(this))
      form.addEventListener('submit', this.onFormSubmit.bind(this))
      this.resetForm()
    }
  }

  onFileChange (evt) {
    this.setFormEnabled()
    this.setFileLabel(evt.target.files[0].name)
    this.resetOutput()
  }

  async onFormSubmit (evt) {
    evt.preventDefault()

    this.resetOutput()
    this.showSpinner()
    this.setFormDisabled()

    try {
      const file = this.el.get('file')
      if (isFileTooLarge(file.files[0], file.dataset.limit)) {
        throw new TypeError('NetworkError: File too large')
      }

      const form = this.el.get('form')
      const response = await postTranscribe(new FormData(form))

      // TODO: this might fail, add manual way to download
      await download(response)

      this.resetPostState()
      this.resetForm()
    } catch (err) {
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

      this.showError(errMessage)
    } finally {
      this.resetPostState()
    }
  }

  resetForm () {
    this.setFormDisabled()

    if (this.originalFileLabel) {
      this.setFileLabel(this.originalFileLabel)
    }

    const form = this.el.get('form')
    form.reset()
  }

  resetOutput () {
    const output = this.el.get('output')
    const outputError = this.el.get('outputError')

    if (output.classList.contains('is-active')) {
      outputError.innerHTML = ''
      output.classList.remove('is-active')
    }
  }

  resetPostState () {
    const spinner = this.el.get('spinner')
    const submit = this.el.get('submit')

    if (spinner.classList.contains('is-active')) {
      spinner.classList.remove('is-active')
    }

    if (submit.hasAttribute('disabled')) {
      submit.removeAttribute('disabled')
    }
  }

  setFormDisabled () {
    const submit = this.el.get('submit')
    submit.setAttribute('disabled', '')
  }

  setFormEnabled () {
    const submit = this.el.get('submit')
    submit.removeAttribute('disabled')
  }

  setFileLabel (name) {
    const fileLabel = this.el.get('fileLabel')

    this.originalFileLabel = fileLabel.innerHTML
    fileLabel.innerHTML = name
  }

  showSpinner () {
    const spinner = this.el.get('spinner')
    spinner.classList.add('is-active')
  }

  showError (message) {
    const output = this.el.get('output')
    const outputError = this.el.get('outputError')

    outputError.innerHTML = `Error: ${message}`
    output.classList.add('is-active')
  }
}

const form = new FormController()

ready(() => {
  form.init()
})
