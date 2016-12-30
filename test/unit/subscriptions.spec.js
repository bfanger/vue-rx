import Vue from 'vue/dist/vue.common.js'
import Spyable from './Spyable'

function getComponent (value$) {
  return new Vue({
    subscriptions: {
      value: value$
    }
  })
}

describe('vm.$options.subscriptions', () => {
  it('should subscribe and unsubscribe based on component lifecycle', () => {
    const value$ = new Spyable()
    // subscribe (in vm.created() )
    expect(value$.subscribe).not.toHaveBeenCalled()
    value$.next('not_yet_listening')
    const vm = getComponent(value$)
    expect(value$.subscribe).toHaveBeenCalled()
    expect(vm.value).toBeUndefined()
    // listen for emitted values
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
