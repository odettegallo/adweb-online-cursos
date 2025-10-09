<template>
  <div class="login-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Login Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="login-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <i class="bi bi-mortarboard-fill text-primary" style="font-size: 3rem;"></i>
              </div>
              <h2 class="fw-bold text-dark mb-2">Iniciar Sesión</h2>
              <p class="text-muted">Accede a tu cuenta de ADWEB Online</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="login-form">
              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">
                  <i class="bi bi-envelope me-2"></i>Correo Electrónico
                </label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="email"
                  v-model="formData.email"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="tu@email.com"
                  required
                >
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">
                  <i class="bi bi-lock me-2"></i>Contraseña
                </label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control form-control-lg"
                    id="password"
                    v-model="formData.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Tu contraseña"
                    required
                  >
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    v-model="formData.rememberMe"
                  >
                  <label class="form-check-label" for="rememberMe">
                    Recordar mi sesión
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 mb-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>

              <!-- Error Message -->
              <div v-if="generalError" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ generalError }}
              </div>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <router-link to="/registro" class="text-primary text-decoration-none fw-semibold">
                    Regístrate aquí
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Right side - Image/Branding -->
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light">
          <div class="text-center">
            <div class="illustration-container mb-4">
              <i class="bi bi-laptop text-primary" style="font-size: 8rem; opacity: 0.8;"></i>
            </div>
            <h3 class="fw-bold text-dark mb-3">Aprende con ADWEB Online</h3>
            <p class="text-muted fs-5 mb-4">
              Accede a cursos de programación web de alta calidad
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Cursos actualizados</span>
              </div>
              <div class="feature-item mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Instructores expertos</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Certificados oficiales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        // Aquí se implementará la lógica de Firebase signInWithEmailAndPassword
        console.log('Login attempt with:', {
          email: this.formData.email,
          password: this.formData.password,
          rememberMe: this.formData.rememberMe
        })
        
        // Simulación de delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Aquí se llamará a Firebase Auth
        // const userCredential = await signInWithEmailAndPassword(auth, this.formData.email, this.formData.password)
        // Redirigir al usuario después del login exitoso
        // this.$router.push('/home')
        
        this.generalError = 'Firebase authentication will be implemented here'
        
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