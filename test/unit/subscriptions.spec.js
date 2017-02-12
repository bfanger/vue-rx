const Vue = require('./vueWithVueRx')
const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

function getComponent (value$) {
  return new Vue({
    subscriptions: {
      value: value$
    },
    render (h) {
      return h('div')
    }
  })
}

describe('vm.$options.subscriptions', () => {
  it('should subscribe and unsubscribe based on component lifecycle', () => {
    const value$ = new Spyable()
    value$.$emit('not_yet_listening')
    const vm = getComponent(value$)
    expect(value$.subscribeSpy).not.toHaveBeenCalled()
    value$.$emit('still_not_listening')
    // subscribe (in vm.beforeMount() )
    vm.$mount()
    expect(value$.subscribeSpy).toHaveBeenCalled()
    expect(vm.value).toBeUndefined()
    // listen for emitted values
    value$.$emit('a_value')
    expect(vm.value).toBe('a_value')
    // stops listening when destroyed
    expect(value$.unsubscribeSpy).not.toHaveBeenCalled()
    vm.$destroy()
    expect(value$.unsubscribeSpy).toHaveBeenCalled()
    value$.$emit('not_listening_anymore')
    expect(vm.value).toBe('a_value')
  })
})
