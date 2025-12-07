import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProductsView from '../views/ProductsView.vue'
import ShopView from '../views/ShopView.vue'
import { getCurrentUser } from '../services/authService'



const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token
  const user = getCurrentUser()
  const role = user?.role ? user.role.toLowerCase() : null

  // Rutas que requieren login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

 // Si ya está logueado e intenta ir a /login o /register
if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
  if (role === 'admin') {
    return next('/users')
  } else {
    return next('/shop')
  }
}


  // Rutas solo admin
  if (to.meta.requiresAdmin && role !== 'admin') {
    if (isAuthenticated) {
      return next('/shop')
    } else {
      return next('/login')
    }
  }

  return next()
})

export default router
