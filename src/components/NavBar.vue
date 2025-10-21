<template>
  <v-app-bar class="bg-purple" elevation="2">
    <v-container>
      <div class="d-flex align-center w-100">
        <RouterLink class="navbar-brand fw-bold text-white text-decoration-none d-flex align-center" to="/">
          <v-icon class="me-2" color="white">mdi-school</v-icon>
          ADWEB Online
        </RouterLink>

        <div class="d-flex align-center ms-6">
          <template v-if="isAuthenticated">
            <RouterLink class="nav-link text-white" to="/home">
              <v-icon class="me-1" color="white">mdi-home</v-icon>
              Inicio
            </RouterLink>
            <RouterLink v-if="isAuthenticated && isAdmin" class="nav-link text-white ms-4" to="/admin">
              <v-icon class="me-1" color="white">mdi-cog</v-icon>
              Administración
            </RouterLink>
          </template>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
          <template v-if="isAuthenticated">
            <span class="navbar-text me-3 d-flex align-center">
              <v-icon class="me-1" color="white">mdi-account-circle</v-icon>
              {{ userName }}
            </span>
            <v-btn variant="outlined" color="white" size="small" @click="handleLogout" prepend-icon="mdi-logout">
              Cerrar Sesión
            </v-btn>
          </template>
          <template v-else>
            <v-btn variant="outlined" color="white" size="small" class="me-2" to="/login" prepend-icon="mdi-login">
              Iniciar Sesión
            </v-btn>
            <v-btn color="white" size="small" class="text-purple fw-bold" to="/registro" prepend-icon="mdi-account-plus">
              Registrarse
            </v-btn>
          </template>
        </div>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'NavBar',
  computed: {
    ...mapState(useAuthStore, {
      isAuthenticated: 'isLoggedIn',
      userEmail: 'currentUserEmail',
      isAdmin: 'isAdmin'
    }),
    userName() {
      return this.userEmail ? this.userEmail.split('@')[0] : '';
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logoutUser']),
    handleLogout() {
      this.logoutUser();
    }
  }
}
</script>

<style scoped>
.bg-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
.text-purple {
  color: #764ba2 !important;
}
.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}
.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
}
.nav-link:hover {
  transform: translateY(-1px);
}
.v-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.navbar-text {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
}
@media (max-width: 991.98px) {
  .nav-link {
    padding: 0.75rem 0;
  }
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
    margin-top: 1rem;
  }
}
</style>