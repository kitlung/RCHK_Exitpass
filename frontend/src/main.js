import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// vue-material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
// vue-awesome
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
// bootstrap vue
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// vue-keyboard
import keyboard from 'vue-keyboard'
// vue-good-table
import VueGoodTablePlugin from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
// vue-notification
import Notifications from 'vue-notification'
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faKey, faWalking, faExchangeAlt, faLongArrowAltRight, faCheckCircle, faCog, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faKey, faWalking, faExchangeAlt, faLongArrowAltRight, faCheckCircle, faTimesCircle, faCog, faFileAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import xdLocalStorage from 'xdlocalstorage'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
