import { Subject } from 'rxjs/Subject'

/**
 * A Subject with spies on next, error, complete, subscribe and unsubscribe
 */
class Spyable extends Subject {

  constructor () {
    super()
    spyOn(this, 'spyUnsubscribe')
    spyOn(this, 'error').and.callThrough()
    spyOn(this, 'complete').and.callThrough()
    var self = this
    const realNext = this.next
    spyOn(this, 'next').and.callFake(function (value) {
      self.value = value // mimic a BehaviorSubject
      realNext.call(self, value)
    })
    const realSubscribe = this.subscribe
    spyOn(this, 'subscribe').and.callFake(function (next, error, complete) {
      const subscription = realSubscribe.call(this, ...arguments)
      const realUnsubscribe = subscription.unsubscribe
      var self = this
      subscription.unsubscribe = function () {
        self.spyUnsubscribe()
        return realUnsubscribe.call(this, ...arguments)
      }
      return subscription
    })
  }

  getValue () {
    return this.value
  }

  spyUnsubscribe () { }
}

export default Spyable
