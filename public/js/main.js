// should work without JS, progressive enhancement only
import makeFormController from './controllers/form.js'
import makeLogoController from './controllers/logo.js'
import makeTranscriptsController from './controllers/transcripts.js'

const { Stimulus } = window
const application = Stimulus.Application.start()

makeLogoController(application)
makeFormController(application)
makeTranscriptsController(application)
