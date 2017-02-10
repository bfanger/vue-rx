import Vue from './vueWithVueRx'
import Spyable from './Spyable'

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
    expect(value$.subscribe).not.toHaveBeenCalled()
    value$.next('not_yet_listening')
    const vm = getComponent(value$)
    expect(value$.subscribe).toHaveBeenCalled()
    expect(vm.value).toBe('start')
    // listens for emitted values
    value$.next('a_value')
    expect(vm.value).toBe('a_value')
    // stops listening when destroyed
    expect(value$.spyUnsubscribe).not.toHaveBeenCalled()
    vm.$destroy()
    expect(value$.spyUnsubscribe).toHaveBeenCalled()
    value$.next('not_listening_anymore')
    expect(vm.value).toBe('a_value')
  })
})
