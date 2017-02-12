const Vue = require('vue/dist/vue.min.js')
const VueRx = require('../../vue-rx.js')
const Rx = require('rxjs')

describe('VueRx mixin', () => {
  it('should register methods for every vue instance', () => {
    const vm = new Vue()
    expect(vm.$subscribeTo).toBeUndefined()
    Vue.use(VueRx, Rx)
    expect(typeof vm.$subscribeTo).toBe('function')
    expect(typeof vm.$observableFromValue).toBe('function')
  })
})
