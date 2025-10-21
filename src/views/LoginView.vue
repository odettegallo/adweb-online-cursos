<template>
  <div class="login-container">
    <v-container fluid class="h-100">
      <v-row class="h-100">
        <v-col cols="12" lg="6" class="d-flex align-center justify-center">
          <div class="login-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <v-icon color="primary" size="48">mdi-school</v-icon>
              </div>
              <h2 class="fw-bold text-dark mb-2">Iniciar Sesión</h2>
              <p class="text-muted">Accede a tu cuenta de ADWEB Online</p>
            </div>

            <!-- Login Form -->
            <v-form @submit.prevent="handleLogin" class="login-form">
              <!-- Email Field -->
              <v-text-field
                v-model="formData.email"
                label="Correo Electrónico"
                type="email"
                :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []"
                prepend-inner-icon="mdi-email"
                density="comfortable"
                required
              />

              <!-- Password Field -->
              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                :error="!!errors.password"
                :error-messages="errors.password ? [errors.password] : []"
                prepend-inner-icon="mdi-lock"
                append-inner-icon="mdi-eye"
                @click:append-inner="togglePassword"
                density="comfortable"
                required
              />

              <!-- Remember Me -->
              <v-checkbox
                v-model="formData.rememberMe"
                label="Recordar mi sesión"
                class="mb-4"
              />

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="w-100 mb-3"
                :loading="isLoading"
                prepend-icon="mdi-login"
              >
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </v-btn>

              <!-- Error Message -->
              <v-alert v-if="generalError" type="error" variant="tonal" class="mb-3">
                {{ generalError }}
              </v-alert>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <RouterLink to="/registro" class="text-primary text-decoration-none fw-semibold">
                    Regístrate aquí
                  </RouterLink>
                </p>
              </div>
            </v-form>
          </div>
        </v-col>

        <!-- Right side - Image/Branding -->
        <v-col cols="12" lg="6" class="d-none d-lg-flex align-center justify-center bg-light">
          <div class="text-center">
            <div class="illustration-container mb-4">
              <v-icon color="primary" size="128" style="opacity: 0.8;">mdi-laptop</v-icon>
            </div>
            <h3 class="fw-bold text-dark mb-3">Aprende con ADWEB Online</h3>
            <p class="text-muted fs-5 mb-4">
              Accede a cursos de programación web de alta calidad
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Cursos actualizados</span>
              </div>
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Instructores expertos</span>
              </div>
              <div class="feature-item">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Certificados oficiales</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'LoginView',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {},
      generalError: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      // Email validation
      if (!this.formData.email) {
        this.errors.email = 'El correo electrónico es requerido'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido'
      }
      
      // Password validation
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (this.formData.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleLogin() {
      this.generalError = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.loginUser(this.formData.email, this.formData.password)
        
        // Redirigir según el rol del usuario
        if (authStore.isAdmin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/home')
        }
        
      } catch (error) {
        console.error('Login error:', error)
        this.generalError = 'Error al iniciar sesión. Verifica tus credenciales.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

.login-form {
  animation: fadeInUp 0.8s ease-out;
}

.form-control {
  border-radius: 12px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-outline-secondary {
  border-radius: 0 12px 12px 0;
  border-left: none;
}

.illustration-container {
  animation: float 3s ease-in-out infinite;
}

.feature-item {
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 991.98px) {
  .login-form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .login-container {
    background: white;
  }
}

@media (max-width: 575.98px) {
  .login-form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
  
  /* Centrado vertical total */
  .login-container {
    height: 100vh; /* asegura altura completa del viewport */
    display: flex;
    align-items: center; /* centra verticalmente el contenido */
  }
</style>