import Vue from './vueWithVueRx'
import Spyable from './Spyable'

function getComponent () {
  return new Vue({
    data: () => ({
      x: 'intial_value'
    }),
    render (h) {
      h('span', this.x)
    }
  })
}

describe('vm.$observableFromValue', () => {
  it('should emit the current value on subscribe', () => {
    const vm = getComponent()
    const observer1 = new Spyable()
    const observer2 = new Spyable()

    expect(observer1.value).toBeUndefined()
    vm.$observableFromValue('x').subscribe(observer1)

    expect(vm.x).toBe('intial_value')
    expect(observer1.value).toBe('intial_value')
    expect(observer1.next).toHaveBeenCalledTimes(1)
    vm.x = 'changed_value'
    vm.$observableFromValue('x').subscribe(observer2)
    expect(observer2.value).toBe('changed_value')
    expect(observer2.next).toHaveBeenCalledTimes(1)
  })

  it('should emit a new value on change', done => {
    const vm = getComponent()
    const observer = new Spyable()
    vm.$observableFromValue('x').subscribe(observer)
    expect(vm.x).toBe('intial_value')
    vm.x = 'changed_value'
    expect(observer.next).toHaveBeenCalledTimes(1)
    vm.$nextTick(() => {
      expect(observer.value).toBe('changed_value')
      expect(observer.next).toHaveBeenCalledTimes(2)
      done()
    })
  })

  it('should complete on $destroy', () => {
    const vm = getComponent()
    const value$ = new Spyable()
    vm.$observableFromValue('x').subscribe(value$)
    vm.$mount()
    expect(value$.complete).not.toHaveBeenCalled()
    vm.$destroy()
    expect(value$.complete).toHaveBeenCalled()
  })

  it('can mimic the $watchAsObservable behavior', done => {
    const vm = getComponent()
    const observer = new Spyable()
    vm.$observableFromValue('x').scan(function (previousPair, value) {
      return {
        newValue: value,
        oldValue: previousPair && previousPair.newValue
      }
    }, {}).skip(1).subscribe(observer) // Remove the skip(1) if you want to mimic the behavior of $watchobservableFromValue with {immediate: true}

    expect(observer.value).toBeUndefined()
    vm.x = 'changed_value'

    vm.$nextTick(() => {
      expect(observer.value).toEqual({
        newValue: 'changed_value',
        oldValue: 'intial_value'
      })
      expect(observer.next).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
