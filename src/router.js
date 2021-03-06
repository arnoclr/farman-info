import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Landing from '@/components/Landing'
import Magazine from '@/components/magazines/Magazine'
import NotFound from '@/components/NotFound'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Landing Page',
      component: Landing
    },
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
    {
      path: '/magazine/:ref',
      name: 'Magazine',
      component: Magazine,
      params: true
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
	]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router