<template>
  <div class="register-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Branding -->
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light">
          <div class="text-center">
            <div class="illustration-container mb-4">
              <i class="bi bi-person-plus text-primary" style="font-size: 8rem; opacity: 0.8;"></i>
            </div>
            <h3 class="fw-bold text-dark mb-3">Únete a ADWEB Online</h3>
            <p class="text-muted fs-5 mb-4">
              Comienza tu viaje en el desarrollo web
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Registro gratuito</span>
              </div>
              <div class="feature-item mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Acceso inmediato</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Register Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="register-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <i class="bi bi-mortarboard-fill text-primary" style="font-size: 3rem;"></i>
              </div>
              <h2 class="fw-bold text-dark mb-2">Crear Cuenta</h2>
              <p class="text-muted">Regístrate en ADWEB Online</p>
            </div>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" class="register-form">
              <!-- Name Field -->
              <div class="mb-3">
                <label for="name" class="form-label fw-semibold">
                  <i class="bi bi-person me-2"></i>Nombre Completo
                </label>
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="name"
                  v-model="formData.name"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Tu nombre completo"
                  required
                >
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres"
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

              <!-- Confirm Password Field -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label fw-semibold">
                  <i class="bi bi-lock-fill me-2"></i>Confirmar Contraseña
                </label>
                <div class="input-group">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control form-control-lg"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Repite tu contraseña"
                    required
                  >
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="toggleConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="acceptTerms"
                    v-model="formData.acceptTerms"
                    :class="{ 'is-invalid': errors.acceptTerms }"
                    required
                  >
                  <label class="form-check-label" for="acceptTerms">
                    Acepto los 
                    <a href="#" class="text-primary text-decoration-none">términos y condiciones</a>
                    y la 
                    <a href="#" class="text-primary text-decoration-none">política de privacidad</a>
                  </label>
                  <div v-if="errors.acceptTerms" class="invalid-feedback d-block">
                    {{ errors.acceptTerms }}
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 mb-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-person-plus me-2"></i>
                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>

              <!-- Error Message -->
              <div v-if="generalError" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ generalError }}
              </div>

              <!-- Success Message -->
              <div v-if="successMessage" class="alert alert-success" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                {{ successMessage }}
              </div>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  ¿Ya tienes una cuenta?
                  <router-link to="/login" class="text-primary text-decoration-none fw-semibold">
                    Inicia sesión aquí
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      errors: {},
      generalError: '',
      successMessage: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      // Name validation
      if (!this.formData.name.trim()) {
        this.errors.name = 'El nombre es requerido'
      } else if (this.formData.name.trim().length < 2) {
        this.errors.name = 'El nombre debe tener al menos 2 caracteres'
      }
      
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
      } else if (!this.isStrongPassword(this.formData.password)) {
        this.errors.password = 'La contraseña debe contener al menos una letra y un número'
      }
      
      // Confirm password validation
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Confirma tu contraseña'
      } else if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden'
      }
      
      // Terms validation
      if (!this.formData.acceptTerms) {
        this.errors.acceptTerms = 'Debes aceptar los términos y condiciones'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isStrongPassword(password) {
      const hasLetter = /[a-zA-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      return hasLetter && hasNumber
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    async handleRegister() {
      this.generalError = ''
      this.successMessage = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        // Aquí se implementará la lógica de Firebase createUserWithEmailAndPassword
        console.log('Register attempt with:', {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password
        })
        
        // Simulación de delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Aquí se llamará a Firebase Auth
        // const userCredential = await createUserWithEmailAndPassword(auth, this.formData.email, this.formData.password)
        // Actualizar el perfil del usuario con el nombre
        // await updateProfile(userCredential.user, { displayName: this.formData.name })
        // Redirigir al usuario después del registro exitoso
        // this.$router.push('/home')
        
        this.successMessage = 'Cuenta creada exitosamente. Firebase será implementado aquí.'
        
      } catch (error) {
        console.error('Register error:', error)
        this.generalError = 'Error al crear la cuenta. Intenta nuevamente.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

.register-form {
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

.form-check-input.is-invalid {
  border-color: #dc3545;
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
  .register-form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .register-container {
    background: white;
  }
}

@media (max-width: 575.98px) {
  .register-form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
  
  /* Centrado vertical total */
  .register-container {
    height: 100vh; /* asegura altura completa del viewport */
    display: flex;
    align-items: center; /* centra verticalmente el contenido */
  }
</style>