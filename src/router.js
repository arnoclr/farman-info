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
      name: 'LandingPage',
      component: () => import('@/components/Landing')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/components/Contact')
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
      path: '/magazine/:id',
      name: 'Magazine',
      component: () => import('@/components/magazines/List'),
      meta: {
        noTransition: true
      }
    },
    {
      path: '/magazine/:id/view',
      name: 'PdfViewer',
      component: () => import('@/components/magazines/PdfViewer'),
      meta: {
        pwaPromotion: false
      }
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
      path: '/article/:id',
      name: 'articleView',
      component: () => import('@/components/articles/View')
    },
    {
      path: '/article/:id/edit',
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
        requiresAuth: true,
        pwaPromotion: false
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/components/NotFound')
    }
	]
})

const getPWADisplayMode = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
window.PWADisplayMode = getPWADisplayMode()

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = auth.currentUser

  const urlParams = new URLSearchParams('?' + to.fullPath.split('?')[1])

  window.ref = to.params.ref || urlParams.get('ref') || 'none'
  console.log(window.ref)
  analytics.logEvent('page_view', { 
    ref: window.ref,
    display_mode: window.PWADisplayMode
  })

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