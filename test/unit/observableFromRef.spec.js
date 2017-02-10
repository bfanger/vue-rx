import Vue from './vueWithVueRx'
import Spyable from './Spyable'

describe('vm.$observableFromRef()', () => {
  it('should emit $refs when changed', () => {
    const vm = new Vue({
      data: () => ({
        visible: true
      }),
      template: '<span ref="mySpan" v-if="visible">vue</span>'
    })
    const spy = new Spyable()
    vm.$observableFromRef('mySpan').subscribe(spy)
    expect(spy.next).toHaveBeenCalledTimes(0)
    vm.$mount()
    expect(spy.next).toHaveBeenCalledTimes(1)
    expect(spy.value).toBe(vm.$el)

    vm.visible = false
    return vm.$nextTick().then(() => {
      expect(spy.next).toHaveBeenCalledTimes(2)
      expect(spy.value).toBeUndefined()
    })
  })

  it('should emit $refs arrays when changed', () => {
    const vm = new Vue({
      template:
      `<div class="house">
        <div ref="lights" v-for="place in places">{{place}}</div>
        {{lights}}
      </div>`,
      data: () => ({
        places: ['livingroom', 'kitchen', 'bathroom'],
        lights: 3
      })
    })
    const spy = new Spyable()
    vm.$observableFromRef('lights').subscribe(spy)
    expect(spy.next).toHaveBeenCalledTimes(0)
    vm.$mount()
    expect(spy.next).toHaveBeenCalledTimes(1)
    expect(spy.value).toBeInstanceOf(Array)
    expect(spy.value.length).toBe(3)

    return Promise.resolve().then(() => {
      vm.places.splice(vm.places.indexOf['kitchen'], 1)
      return vm.$nextTick()
    }).then(() => {
      expect(spy.value.length).toBe(2)
      expect(spy.next).toHaveBeenCalledTimes(2)
      vm.lights = 2
      return vm.$nextTick()
    }).then(() => {
      expect(spy.value.length).toBe(2)
      expect(spy.next).toHaveBeenCalledTimes(2)
    })
  })
})
