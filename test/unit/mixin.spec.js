import Vue from 'vue/dist/vue.common.js'

describe('VueRx mixin', () => {
  it('should register methods for every vue instance', () => {
    const vm = new Vue()
    expect(typeof vm.$subscribeTo).toBe('function')
    expect(typeof vm.$fromDOMEvent).toBe('function')
  })
})
