import { createRouter, createWebHistory } from 'vue-router'
import { userAuthStore } from '../stores/auth'
import { userUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import LayoutDashboard from '../layouts/LayoutDashboard.vue'
import LayoutValidateUser from '../layouts/LayoutValidateUser.vue'

const routes = [
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  },
  {
    path: '/',
    redirect: { name: 'login'}
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/registro',
    name: 'registro',
    meta: {
      title: 'Registro'
    },
    component: () => import('../views/Registro.vue')
  },
  {
    path: '/recuperar',
    name: 'recuperar',
    meta: {
      title: 'Eecuperar'
    },
    component: () => import('../views/RecoverPassword.vue')
  },
  {
    path: '/restaurar',
    name: 'restaurar',
    meta: {
      title: 'Restaurar'
    },
    component: () => import('../views/RestorePassword.vue'),
    props: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Cliente,Administrador'
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
      title: 'Nueva Orden',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Cliente'
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
      title: 'Cuentas',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Cliente'
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
      title: 'Ordenes',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Cliente'
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
      title: 'Perfil',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Cliente'
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
      title: 'Validacion Usuario',
      requiresAuth: true,
      layout: LayoutValidateUser,
      rolesAllowed: 'Cliente'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userAuthStore()
      if (userStore.userState === 0) {
        next('/dashboard')
      }
      next()
    }
  },


 /// admin
  {
    path: '/dashboard/users',
    name: 'users',
    component: () => import('../views/Dashboard/Admin/User/index.vue'),
    meta: {
      title: 'Lista Usuarios',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/user/:userId',
    name: 'user',
    component: () => import('../views/Dashboard/Admin/User/idUser.vue'),
    meta: {
      title: 'Detalle de Usuario',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
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
    component: () => import('../views/Dashboard/Admin/Ordenes/index.vue'),
    meta: {
      title: 'Lista de Ordenes',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/pagos',
    name: 'pagos',
    component: () => import('../views/Dashboard/Admin/Pagos/index.vue'),
    meta: {
      title: 'Lista de Pagos',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/devoluciones',
    name: 'devoluciones',
    component: () => import('../views/Dashboard/Admin/Devoluciones/index.vue'),
    meta: {
      title: 'Lista de devoluciones',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
  {
    path: '/dashboard/pagos/:idPago',
    name: 'pago',
    component: () => import('../views/Dashboard/Admin/Pagos/detalle.vue'),
    meta: {
      title: 'Detalle de pago',
      requiresAuth: true,
      layout: LayoutDashboard,
      rolesAllowed: 'Administrador'
    },
    beforeEnter: (to, from, next) => {
      const userStore = userUserStore()
      if (userStore.userState === 0) {
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to,from, next) => {
  document.title = to.meta.title
  const auth = userAuthStore()
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(auth.user && auth.isLogged) {
      if( to.meta.rolesAllowed.split(',').includes(auth.user.rol.name)){
        return next()
      } else {
        return next({
          path: 'Unauthorized',
          replace: true
        })
      }
    }else {
      return next({
        path: '/login',
        replace: true
      })
    }
  }else {
    if (auth.user && auth.isLogged) {
      return next('/dashboard')
    }else {
      return next()
    }
  }
  // const authRequired = !publicPages.includes(to.path)
  // const auth = userAuthStore()
  // if(authRequired && !auth.user) {
  //   auth.returnUrl = to.fullPath
  //   return '/login'
  // }
  // if(!authRequired && auth.user && auth.isLogged) {
  // rolesAllowed: 'Cliente'= 2) {
  //       return '/dashboard';
  //     } else {
  //       router.push({path: '/login'});
  //     }
  //   } else if (to.meta.userAuth) {
  //     if(auth.user.id_rol === 1) {
  //       return '/dashboard';
  //     } else {
  //       router.push({path: '/login'});
  //     }
  //   }
  //   return '/dashboard'
  // }
})

export default router
