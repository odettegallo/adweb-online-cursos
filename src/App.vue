<template>
  <div id="app">
    <!-- NavBar se muestra solo en rutas que no sean login o registro -->
    <NavBar v-if="showNavBar" />
    
    <!-- Contenido principal -->
    <main :class="{ 'with-navbar': showNavBar }">
      <RouterView />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    showNavBar() {
      // Ocultar NavBar en las páginas de login y registro
      const hiddenRoutes = ['/login', '/registro']
      return !hiddenRoutes.includes(this.$route.path)
    }
  }
}
</script>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

main.with-navbar {
  padding-top: 0;
}

/* Utilidades de Bootstrap personalizadas */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.border-radius-custom {
  border-radius: 15px;
}

/* Animaciones globales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus states mejorados */
.form-control:focus,
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Loading spinner personalizado */
.spinner-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
/* Blur y oscurecer fondo cuando hay modal abierto */
body.modal-open main {
  filter: blur(3px);
}

.modal-backdrop.show {
  opacity: 0.5;
}
