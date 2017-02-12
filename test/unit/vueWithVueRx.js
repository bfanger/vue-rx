const Vue = require('vue/dist/vue.min.js')
const VueRx = require('../../vue-rx.js')
const Rx = require('./rx')

Vue.use(VueRx, Rx)

module.exports = Vue
