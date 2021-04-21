import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _fa2473ea = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _338b0400 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _3e0dc468 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _210e52c4 = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _6a55ca30 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _771eec4e = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _9cc14396 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _fa2473ea,
    children: [{
      path: "",
      component: _338b0400,
      name: "home"
    }, {
      path: "/login",
      component: _3e0dc468,
      name: "login"
    }, {
      path: "/register",
      component: _3e0dc468,
      name: "register"
    }, {
      path: "/settings",
      component: _210e52c4,
      name: "settings"
    }, {
      path: "/profile/:username",
      component: _6a55ca30,
      name: "profile"
    }, {
      path: "/editor",
      component: _771eec4e,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _9cc14396,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
