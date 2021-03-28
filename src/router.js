import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Landing Page',
      component: () => import('@/components/Landing'),
      meta: {
        title: 'Farman, bientôt disponible ...'
      }
    },
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/components/Login'),
      meta: {
        title: 'Se connecter'
      }
		},
    {
      path: '/unsubscribe',
      name: 'Unsubscribe',
      component: () => import('@/components/Unsubscribe'),
      meta: {
        requiresAuth: true,
        title: 'Se désinscrire de la lettre d\'informations'
      }
    },
    {
			path: '/magazines',
			name: 'Magazines',
			component: () => import('@/components/magazines/List'),
      meta: {
        title: 'Les derniers magazines'
      }
		},
    {
      path: '/magazine/:ref',
      name: 'Magazine',
      component: () => import('@/components/magazines/Magazine'),
      params: true,
      meta: {
        title: 'Magazine'
      }
    },
    {
      path: '/magazine/:ref/view',
      name: 'PdfViewer',
      component: () => import('@/components/magazines/PdfViewer'),
      params: true,
      meta: {
        title: 'Liseuse du magazine'
      }
    },
    {
      path: '/articles/submit',
      name: 'articleSubmit',
      component: () => import('@/components/articles/Submit'),
      meta: {
        requiresAuth: true,
        title: 'Proposer un article'
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
      component: () => import('@/components/NotFound'),
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
    next('/login?ref=auto_redirect')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router