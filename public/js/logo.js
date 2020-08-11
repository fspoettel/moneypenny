const { Stimulus } = window

export default function makeLogoController (application) {
  application.register('logo', class extends Stimulus.Controller {
    static get targets () {
      return ['step']
    }

    connect () {
      const interval = setInterval(this.onTick.bind(this), 1000)
      this.data.set('interval', interval)
    }

    disconnect () {
      clearInterval(this.data.get('interval'))
    }

    onTick () {
      const index = parseInt(this.data.get('index'), 10) || 0
      this.showNextFrame(index)
    }

    showNextFrame (currentIndex) {
      const steps = this.stepTargets
      const nextIndex = currentIndex === steps.length - 1
        ? 0
        : currentIndex + 1

      this.data.set('index', nextIndex)

      steps.forEach((el, i) => {
        if (i === nextIndex) {
          el.classList.add('active')
        } else {
          el.classList.remove('active')
        }
      })
    }
  })
}
