import Vue from 'vue'
import Router from 'vue-router'
import mr from './views/mr'
import timing from './views/timing'
import over from './views/over'
import about from './views/about'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mr',
      component: mr,
    },
    {
      path: '/timing',
      name: 'timing',
      component: timing,
    },
    {
      path: '/over',
      name: 'over',
      component: over,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
  ]
})
