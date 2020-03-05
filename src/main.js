import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {
  ebtRenderer
} from 'electron-baidu-tongji'
if (process.env.VUE_APP_LINXF == "electron") {
  var BAIDU_SITE_ID = '55c9cfe8204a9832b4cedf53b88d7683'
  var ipcRenderer = window.require("electron").ipcRenderer
  ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?898625cb72f4c54cd53fc6c190baa41a";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
} else {
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c590dd209b573bc8560301e31e850f8b";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
}

import '@/assets/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en'
})

import {
  BreadstickBakery
} from 'breadstick'
// This exposes `this.$breadstick` in your Vue template.
Vue.use(BreadstickBakery)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')