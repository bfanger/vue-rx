/*global NodeList, HTMLInputElement */
const Vue = require('./vueWithVueRx')
const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

describe('vm.$observableFromQuerySelectorAll', () => {
  it('should find the elements based on the selector', () => {
    const vm = new Vue({
      template: `
        <form>
            <input type="email" name="email">
            <input type="password" name="password">
        </form>`
    })
    vm.$mount()
    const spy = new Spyable()
    vm.$observableFromQuerySelectorAll('[name]').subscribe(spy)
    expect(spy.value).toBeInstanceOf(NodeList)
    expect(spy.value.length).toBe(2)
    expect(spy.value[0]).toBeInstanceOf[HTMLInputElement]
  })
})
