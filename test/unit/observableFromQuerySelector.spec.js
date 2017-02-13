/*global HTMLInputElement */
const Vue = require('./vueWithVueRx')
const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

describe('vm.$observableFromQuerySelector', () => {
  it('should find the element based on the selector', () => {
    const vm = new Vue({
      template: `
        <form>
            <input type="email" name="email">
            <input type="password" name="password">
        </form>`
    })
    vm.$mount()
    const spy = new Spyable()
    vm.$observableFromQuerySelector('[name="email"]').subscribe(spy)
    expect(spy.value).toBeInstanceOf(HTMLInputElement)
  })
})
