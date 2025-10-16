import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import EditarCursoView from '../views/EditarCursoView.vue'
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
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
        requiresAuth: false,
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

  // Verificar autenticación solo para rutas protegidas
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // 🔑 CAMBIO CLAVE: Usa Pinia Store
  const authStore = useAuthStore() // Obtiene la instancia del store
  // Asumo que tu getter se llama 'isLoggedIn' según NavBar.vue
  const isAuthenticated = authStore.isLoggedIn 

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
