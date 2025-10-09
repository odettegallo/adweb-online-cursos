import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import EditarCursoView from '../views/EditarCursoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { 
        requiresAuth: false,
        title: 'Iniciar Sesión - ADWEB Online'
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: RegistroView,
      meta: { 
        requiresAuth: false,
        title: 'Crear Cuenta - ADWEB Online'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: 'Inicio - ADWEB Online'
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      meta: { 
        requiresAuth: true,
        title: 'Administración - ADWEB Online'
      }
    },
    {
      path: '/editar-curso/:id?',
      name: 'EditarCurso',
      component: EditarCursoView,
      meta: { 
        requiresAuth: true,
        title: 'Editar Curso - ADWEB Online'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

// Navigation guard para proteger rutas
router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Verificar autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // Aquí se verificará el estado de autenticación con Firebase
    // Por ahora, redirigir a login si la ruta requiere autenticación
    const isAuthenticated = false // Esto será manejado por el store de autenticación
    
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    // Si el usuario está autenticado y trata de acceder a login/registro, redirigir a home
    const isAuthenticated = false // Esto será manejado por el store de autenticación
    
    if (isAuthenticated && (to.path === '/login' || to.path === '/registro')) {
      next('/home')
    } else {
      next()
    }
  }
})

export default router
