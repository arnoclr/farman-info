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
      component: Landing,
      meta: {
        title: 'Farman, bientôt disponible ...'
      }
    },
		{
			path: '/login',
			name: 'Login',
			component: Login,
      meta: {
        title: 'Se connecter'
      }
		},
    {
			path: '/magazines',
			name: 'Magazines',
			component: Magazines,
      meta: {
        title: 'Les derniers magazines'
      }
		},
    {
      path: '/magazine/:ref',
      name: 'Magazine',
      component: Magazine,
      params: true,
      meta: {
        title: 'Magazine'
      }
    },
    {
      path: '/magazine/:ref/view',
      name: 'PdfViewer',
      component: PdfViewer,
      params: true,
      meta: {
        title: 'Liseuse du magazine'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/components/admin/Main'),
      meta: {
        requiresAuth: true,
        title: 'Administration'
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: 'Page non trouvée - err:404'
      }
    }
	]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  document.title = to.meta.title || 'Farman - Actualités Aéronautiques'

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