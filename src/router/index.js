import { createRouter, createWebHistory } from 'vue-router'
import { userAuthStore } from '../stores/auth'
import { userUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import LayoutDashboard from '../layouts/LayoutDashboard.vue'
import LayoutValidateUser from '../layouts/LayoutValidateUser.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'login'}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/Registro.vue')
  },
  {
    path: '/recuperar',
    name: 'recuperar',
    component: () => import('../views/RecoverPassword.vue')
  },
  {
    path: '/restaurar',
    name: 'restaurar',
    component: () => import('../views/RestorePassword.vue'),
    props: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard/index.vue'),
    meta: {
      layout: LayoutDashboard
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState !== 0) {
        next('/validateUser')
      }
      next()
    },
  },
  {
    path: '/dashboard/nueva-orden',
    name: 'nueva-orden',
    component: () => import('../views/Dashboard/Orden/index.vue'),
    meta: {
      layout: LayoutDashboard
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/cuentas',
    name: 'cuentas',
    component: () => import('../views/Dashboard/Bancos/index.vue'),
    meta: {
      layout: LayoutDashboard
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/ordenes',
    name: 'ordenes',
    component: () => import('../views/Dashboard/Ordenes/index.vue'),
    meta: {
      layout: LayoutDashboard
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/perfil',
    name: 'perfil',
    component: () => import('../views/Dashboard/Perfil/index.vue'),
    meta: {
      layout: LayoutDashboard
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/validateUser',
    name: 'validateUser',
    component: () => import('../views/Dashboard/ValidateUser/index.vue'),
    meta: {
      layout: LayoutValidateUser,
    },
    beforeEnter: (to, from, next) => {
      const userStore = userAuthStore()
      if (userStore.userState === 0) {
        next('/dashboard')
      }
      next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach( async (to) => {
  const publicPages = ['/','/login','/registro','/recuperar','/restaurar']
  const authRequired = !publicPages.includes(to.path)
  const auth = userAuthStore()
  if(authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return '/login'
  }
  if(!authRequired && auth.user && auth.isLogged) {
    return '/dashboard'
  }
})

export default router
