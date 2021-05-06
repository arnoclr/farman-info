import Vue from 'vue'
import Router from 'vue-router'
import {auth, analytics} from './firebaseConfig'

const REGEX_REF = /([&?]ref=\w+)/

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
      path: '/articles',
      name: 'articleList',
      component: () => import('@/components/articles/List'),
      meta: {
        title: 'Tous les articles'
      }
    },
    {
      path: '/articles/author/:author',
      name: 'articleListAuthor',
      component: () => import('@/components/articles/List'),
      meta: {
        title: 'Tous les articles'
      }
    },
    {
      path: '/articles/category/:category',
      name: 'articleListCategory',
      component: () => import('@/components/articles/List'),
      meta: {
        title: 'Tous les articles'
      }
    },
    {
      path: '/article/:ref',
      name: 'articleView',
      component: () => import('@/components/articles/View'),
      meta: {
        title: 'Lecture d\'un article'
      }
    },
    {
      path: '/article/:ref/edit',
      name: 'articleEdit',
      component: () => import('@/components/articles/Submit'),
      meta: {
        title: 'Edition article',
        requiresAuth: true
      }
    },
    {
      path: '/admin/:section?',
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
  const currentUser = auth.currentUser

  document.title = to.meta.title || 'Farman - Actualités Aéronautiques'

  let urlParams = new URLSearchParams('?' + to.fullPath.split('?')[1])
  analytics.logEvent('page_view', { 
    type: 'internal',
    click_source: urlParams.get('ref')
  })
  if (window.history.replaceState) {
    //prevents browser from storing history with each change:
    setTimeout(() => {
      window.history.replaceState('', document.title, to.fullPath.replace(REGEX_REF, ''))
    }, 250);
  }

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