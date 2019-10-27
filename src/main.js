import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/fontawesome/css/all.css'
import './assets/css.css'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en'
})

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')

