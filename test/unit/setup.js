import 'babel-polyfill'
import Vue from 'vue/dist/vue.common.js'
import VueRx from '../../vue-rx.js'
import Rx from 'rxjs'

Vue.use(VueRx, Rx)
