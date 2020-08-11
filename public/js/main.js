// should work without JS, progressive enhancement only
import makeLogoController from './logo.js'
import makeFormController from './form.js'

const { Stimulus } = window
const application = Stimulus.Application.start()

makeLogoController(application)
makeFormController(application)
