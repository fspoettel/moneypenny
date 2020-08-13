// should work without JS, progressive enhancement only
import makeFormController from './controllers/form.js'
import makeStepperController from './controllers/stepper.js'
import makeTranscriptsController from './controllers/transcripts.js'

const { Stimulus } = window
const application = Stimulus.Application.start()

makeStepperController(application)
makeFormController(application)
makeTranscriptsController(application)
