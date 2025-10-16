<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-purple shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-mortarboard-fill me-2"></i>
        ADWEB Online
      </router-link>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
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

        <div class="navbar-nav ms-auto">
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
          <div v-else class="d-flex gap-2">
            <router-link 
              class="btn btn-outline-light btn-sm" 
              to="/login"
            >
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Iniciar Sesión
            </router-link>
            <router-link 
              class="btn btn-light btn-sm text-purple fw-bold" 
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
// 1. Importar las herramientas de Pinia
import { useAuthStore } from '@/stores/authStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'NavBar',
  // Elimina 'data()' y 'created()' si contenían lógica de autenticación temporal.
  
  // 2. Mapear el estado del store a propiedades computadas del componente
  computed: {
    ...mapState(useAuthStore, {
      // Mapea el getter 'isLoggedIn' del store al 'isAuthenticated' del template
      isAuthenticated: 'isLoggedIn',     
      // Mapea el getter 'currentUserEmail' del store al 'userEmail' del template
      userEmail: 'currentUserEmail'      
    })
  },
  methods: {
    // 3. Mapear la acción de logout del store a un método del componente
    ...mapActions(useAuthStore, ['logoutUser']),

    handleLogout() {
      // 4. Llama a la acción mapeada, la cual ejecuta el signOut y la redirección
      this.logoutUser();
    }
  }
}
</script>



<style scoped>
/* ESTILOS DE COLOR MODIFICADOS */
.bg-purple {
  /* ¡CLAVE! Aplicamos el gradiente lineal del Login */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; 
}
.text-purple {
  color: #764ba2 !important;
}

/* Resto de estilos originales */
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