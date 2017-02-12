/*global MouseEvent*/
const Vue = require('./vueWithVueRx')
const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

describe('vm.$observableFromEvent()', () => {
  it('should listen to vue events', () => {
    const vm = new Vue({
      template: '<span></span>'
    })
    const spy = new Spyable()
    vm.$observableFromEvent('myEvent').subscribe(spy)
    vm.$emit('myEvent')
    expect(spy.nextSpy).toHaveBeenCalledTimes(1)
  })

  it('should listen to DOM events', () => {
    const vm = new Vue({
      template: '<button>Click me</button>'
    })
    const spy = new Spyable()
    vm.$mount()
    document.body.appendChild(vm.$el) // dom element must be in the document, otherwise the event doesnt bubblu up to the eventlistener
    vm.$observableFromEvent('click', null).subscribe(spy)
    vm.$el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(spy.nextSpy).toHaveBeenCalledTimes(1)
  })
})
