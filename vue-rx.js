/*global Vue Rx define*/

(function () {
  function VueRx(Vue, Rx) {
    var warn = Vue.util.warn || function () { }

    function observableCreate(subscribe) {
      var _rx = Rx || (typeof window !== 'undefined' && window.Rx) || (typeof global !== 'undefined' && global.Rx)
      if (!_rx || !_rx.Observable || !_rx.Observable.create) {
        warn(
          'Unable to create an Observable. VueRx requires Rx to be present ' +
          'globally or be passed to Vue.use() as the second argument.',
          vm
        )
        return false
      }
      return _rx.Observable.create(subscribe)
    }

    function unsubscribe(subscription) {
      if (subscription.unsubscribe) { // a RxJS 5 Subscription
        subscription.unsubscribe()
      } else if (subscription.dispose) {  // a RxJS 4 Disposable
        subscription.dispose()
      } else {
        warn('Unable to unsubscribe')
      }
    }

    function defineReactive(vm, key, val) {
      if (key in vm) {
        vm[key] = val
      } else {
        Vue.util.defineReactive(vm, key, val)
      }
    }

    Vue.mixin({
      beforeMount: function () {
        var vm = this
        var observables = vm.$options.subscriptions
        if (typeof observables === 'function') {
          observables = observables.call(vm)
        }
        if (!observables) return

        Object.keys(observables).forEach(function (key) {
          defineReactive(vm, key, undefined)
          var observable = observables[key]
          if (!observable || typeof observable.subscribe !== 'function') {
            warn(
              'Invalid Observable found in subscriptions option with key "' + key + '".',
              vm
            )
            return
          }
          vm.$subscribeTo(observable, function (value) {
            vm[key] = value
          })
        })
      },
      beforeDestroy: function () {
        if (this.$$managedSubscriptions) {
          this.$$managedSubscriptions.forEach(unsubscribe)
        }
      }
    })

    Vue.prototype.$observableFromValue = function (expOrFn, options) {
      options = options || {}
      if (typeof options.immediate === 'undefined') {
        options.immediate = true
      }

      var vm = this
      return observableCreate(function (observer) {
        var unwatch
        function watch() {
          unwatch = vm.$watch(expOrFn, function (value) {
            observer.next(value)
          }, options)
        }

        if (vm._data) { // data has been observed?
          watch()
        } else { // wait until created hook, otherwise the watcher will not work.
          vm.$once('hook:created', watch)
        }

        vm.$once('hook:destroyed', function () {
          observer.complete()
        })

        return function unsubscribe() {
          if (unwatch) {
            unwatch()
          } else {
            vm.$once('hook:created', unwatch)
          }
        }
      })
    }

    Vue.prototype.$observableFromEvent = function (event, selector) {
      if (typeof window === 'undefined') {
        return observableCreate(function () { })
      }

      var vm = this
      if (typeof selector === 'undefined') { // Listen to Vue events
        return observableCreate(function (observer) {
          function listener(e) {
            observer.next(e)
          }
          vm.$on(event, listener)
          return function unsubscribe() {
            vm.$off(event, listener)
          }
        })
      } else { // Listen to DOM events
        var rootElement = document.documentElement
        return observableCreate(function (observer) {
          function listener(e) {
            if (!vm.$el) return;
            if (selector === null && vm.$el === e.target) return observer.next(e)
            var els = vm.$el.querySelectorAll(selector);
            var el = e.target;
            for (var i = 0, len = els.length; i < len; i++) {
              if (els[i] === el) return observer.next(e)
            }
          }
          rootElement.addEventListener(event, listener)
          vm.$once('hook:destroyed', function () {
            observer.complete()
          })
          return function unsubscribe() {
            rootElement.removeEventListener(event, listener)
          }
        })
      }
    }

    Vue.prototype.$subscribeTo = function (observable, next, error, complete) {
      var subscription = observable.subscribe(next, error, complete)
      if (!this.$$managedSubscriptions) {
        this.$$managedSubscriptions = []
      }
      this.$$managedSubscriptions.push(subscription)
      return subscription
    }
  }

  // auto install
  if (typeof Vue !== 'undefined' && typeof Rx !== 'undefined') {
    Vue.use(VueRx, Rx)
  }

  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = VueRx
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return VueRx })
  } else if (typeof window !== 'undefined') {
    window.VueRx = VueRx
  }
})()
