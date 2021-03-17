import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Landing from '@/components/Landing'
import Magazine from '@/components/magazines/Magazine'
import Magazines from '@/components/magazines/List'
import PdfViewer from '@/components/magazines/PdfViewer'
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
			path: '/magazines',
			name: 'Magazines',
			component: Magazines
		},
    {
      path: '/magazine/:ref',
      name: 'Magazine',
      component: Magazine,
      params: true
    },
    {
      path: '/magazine/:ref/view',
      name: 'PdfViewer',
      component: PdfViewer,
      params: true
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/components/admin/Main'),
      meta: {
        requiresAuth: true
      }
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
    localStorage.setItem('login-from-url', to.fullPath)
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router