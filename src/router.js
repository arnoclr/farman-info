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
      component: () => import('@/components/Landing')
    },
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/components/Login')
		},
    {
      path: '/unsubscribe',
      name: 'Unsubscribe',
      component: () => import('@/components/Unsubscribe'),
      meta: {
        requiresAuth: true
      }
    },
    {
			path: '/magazines',
			name: 'Magazines',
			component: () => import('@/components/magazines/List')
		},
    {
      path: '/magazine/:ref',
      name: 'Magazine',
      component: () => import('@/components/magazines/Magazine'),
      params: true
    },
    {
      path: '/magazine/:ref/view',
      name: 'PdfViewer',
      component: () => import('@/components/magazines/PdfViewer'),
      params: true
    },
    {
      path: '/articles/submit',
      name: 'articleSubmit',
      component: () => import('@/components/articles/Submit'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/articles',
      name: 'articleList',
      component: () => import('@/components/articles/List')
    },
    {
      path: '/articles/author/:author',
      name: 'articleListAuthor',
      component: () => import('@/components/articles/List')
    },
    {
      path: '/articles/category/:category',
      name: 'articleListCategory',
      component: () => import('@/components/articles/List')
    },
    {
      path: '/article/:ref',
      name: 'articleView',
      component: () => import('@/components/articles/View')
    },
    {
      path: '/article/:ref/edit',
      name: 'articleEdit',
      component: () => import('@/components/articles/Submit'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/:section?',
      name: 'admin',
      component: () => import('@/components/admin/Main'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/components/NotFound')
    }
	]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = auth.currentUser

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