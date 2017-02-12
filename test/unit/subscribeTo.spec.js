const Vue = require('./vueWithVueRx')
const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

function getComponent (value$) {
  return new Vue({
    data: () => ({
      value: 'start'
    }),
    created () {
      this.$subscribeTo(value$, value => {
        this.value = value
      })
    }
  })
}

describe('vm.$subscribeTo', () => {
  it('should subscribe and unsubscribe based on component lifecycle', () => {
    const value$ = new Spyable()
    // subscribe (in vm.created() )
    expect(value$.subscribeSpy).not.toHaveBeenCalled()
    value$.$emit('not_yet_listening')
    const vm = getComponent(value$)
    expect(value$.subscribeSpy).toHaveBeenCalled()
    expect(vm.value).toBe('start')
    // listens for emitted values
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
