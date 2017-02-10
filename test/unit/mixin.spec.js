import Vue from 'vue/dist/vue.min.js'
import VueRx from '../../vue-rx.js'
import Rx from 'rxjs'

describe('VueRx mixin', () => {
  it('should register methods for every vue instance', () => {
    const vm = new Vue()
    expect(vm.$subscribeTo).toBeUndefined()
    Vue.use(VueRx, Rx)
    expect(typeof vm.$subscribeTo).toBe('function')
    expect(typeof vm.$observableFromValue).toBe('function')
  })
})
