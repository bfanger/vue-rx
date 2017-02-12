
module.exports = function (Rx) {
  if (!Rx.Subject) {
    throw new Error('Rx.Subject is required for Spyable')
  }
  const mapping = Rx.Subject.prototype.unsubscribe ? {
    // RxJS 5
    next: 'next',
    complete: 'complete',
    error: 'error',
    subscribe: 'subscribe',
    unsubscribe: 'unsubscribe'
  } : {
    // RxJS 4
    next: 'onNext',
    complete: 'onCompleted',
    error: 'onError',
    subscribe: 'subscribe',
    unsubscribe: 'dispose'
  }

  /**
   * A Subject with spies on next, error, complete, subscribe and unsubscribe
   */
  return class Spyable extends Rx.Subject {

    constructor () {
      super()

      this._real = {}
      for (const method in mapping) {
        const realMethod = mapping[method]
        this._real[method] = this[realMethod]
        this[realMethod] = function () {
          return this[method + 'Spy'].apply(this, arguments)
        }
        spyOn(this, method + 'Spy').and.callThrough()
      }
    }

    $emit (value) {
      this[mapping.next](value)
    }
    $emitError (error) {
      this[mapping.error](error)
    }
    $emitComplete () {
      this[mapping.complete]()
    }

    getValue () {
      return this.value
    }
    getError () {
      return this.error
    }

    nextSpy (value) {
      this.value = value // mimic a BehaviorSubject
      return this._real.next.call(this, value)
    }
    completeSpy () {
      return this._real.complete.call(this)
    }
    errorSpy (error) {
      this.error = error
      return this._real.error.call(this, error)
    }

    subscribeSpy (next, error, complete) {
      const subscription = this._real.subscribe.apply(this, arguments)
      const realUnsubscribe = subscription[mapping.unsubscribe]
      const self = this
      subscription[mapping.unsubscribe] = function () {
        self.unsubscribeSpy(true)
        return realUnsubscribe.call(subscription)
      }
      return subscription
    }
    unsubscribeSpy (fromSubscription) {
      if (fromSubscription) {
        return
      }
      return this._real.unsubscribe.call(this)
    }
  }
}
