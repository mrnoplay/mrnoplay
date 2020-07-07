import Vue from 'vue'
import Router from 'vue-router'
import mr from './views/mr'
import timing from './views/timing'
import over from './views/over'
import about from './views/about'
import settings from './views/settings'
import tutorial from './views/tutorial'
import donate from './views/donate'
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
    {
      path: '/settings',
      name: 'settings',
      component: settings,
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: tutorial,
    },
    {
      path: '/donate',
      name: 'donate',
      component: donate,
    },
  ]
})
