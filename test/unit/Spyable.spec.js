const Rx = require('./rx')
const Spyable = require('./Spyable')(Rx)

describe('Spyable', () => {
  it('should be able to spy on the Observer methods', () => {
    var spy = new Spyable()
    expect(spy.value).toBeUndefined()
    expect(spy.nextSpy).toHaveBeenCalledTimes(0)
    spy.$emit(123)
    expect(spy.nextSpy).toHaveBeenCalledTimes(1)
    expect(spy.value).toBe(123)
    spy.$emitError('Oops')
    expect(spy.error).toBe('Oops')
  })

  it('should be able to spy on the Observable methods', () => {
    const spy = new Spyable()
    var value
    expect(spy.subscribeSpy).toHaveBeenCalledTimes(0)
    const subscription = spy.subscribe(_value => {
      value = _value
    })
    expect(spy.subscribeSpy).toHaveBeenCalledTimes(1)
    spy.$emit(123)
    expect(value, 123)
    expect(spy.unsubscribeSpy).toHaveBeenCalledTimes(0)
    if (subscription.unsubscribe) {
      subscription.unsubscribe()
    } else {
      subscription.dispose()
    }
    expect(spy.unsubscribeSpy).toHaveBeenCalledTimes(1)
  })
})
