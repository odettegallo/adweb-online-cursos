<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
      <!-- Logo/Brand -->
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-mortarboard-fill me-2"></i>
        ADWEB Online
      </router-link>

      <!-- Mobile toggle button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Navigation links will be added here when authenticated -->
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/home">
              <i class="bi bi-house-fill me-1"></i>
              Inicio
            </router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/admin">
              <i class="bi bi-gear-fill me-1"></i>
              Administración
            </router-link>
          </li>
        </ul>

        <!-- User section -->
        <div class="navbar-nav ms-auto">
          <!-- When user is authenticated -->
          <div v-if="isAuthenticated" class="d-flex align-items-center">
            <span class="navbar-text me-3">
              <i class="bi bi-person-circle me-1"></i>
              {{ userEmail }}
            </span>
            <button 
              class="btn btn-outline-light btn-sm" 
              @click="handleLogout"
              type="button"
            >
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          </div>

          <!-- When user is not authenticated -->
          <div v-else class="d-flex gap-2">
            <router-link 
              class="btn btn-outline-light btn-sm" 
              to="/login"
            >
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Iniciar Sesión
            </router-link>
            <router-link 
              class="btn btn-light btn-sm text-primary" 
              to="/registro"
            >
              <i class="bi bi-person-plus me-1"></i>
              Registrarse
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      // Estos valores serán manejados por el store cuando se integre Firebase
      isAuthenticated: false,
      userEmail: ''
    }
  },
  methods: {
    handleLogout() {
      // Método para cerrar sesión - será implementado con Firebase
      console.log('Logout functionality will be implemented with Firebase')
      // Aquí se llamará al método de Firebase signOut()
      // y se actualizará el estado en el store
      // Desarrollo: limpiar perfil temporal
      localStorage.removeItem('dev_isAuthenticated')
      localStorage.removeItem('dev_role')
      localStorage.removeItem('dev_email')
      this.isAuthenticated = false
      this.userEmail = ''
      this.$router.push('/login')
    }
  },
  mounted() {
    // Aquí se verificará el estado de autenticación con Firebase
    // onAuthStateChanged listener será implementado aquí
    console.log('Auth state listener will be implemented with Firebase')
    // Desarrollo: leer autenticación temporal
    const devAuth = localStorage.getItem('dev_isAuthenticated') === 'true'
    const email = localStorage.getItem('dev_email')
    const role = localStorage.getItem('dev_role') || 'Usuario'
    this.isAuthenticated = devAuth
    this.userEmail = email || (role === 'Admin' ? 'admin@dev.local' : 'usuario@dev.local')
  }
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.navbar-nav .nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
}

.navbar-nav .nav-link:hover {
  transform: translateY(-1px);
}

.btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.navbar-text {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
}

@media (max-width: 991.98px) {
  .navbar-nav .nav-link {
    padding: 0.75rem 0;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
    margin-top: 1rem;
  }
}
</style>