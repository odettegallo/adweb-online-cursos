<template>
  <div class="home-container">
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 fw-bold text-gradient mb-1">Inicio</h1>
          <p class="text-muted mb-0">Gestiona y explora los cursos de ADWEB Online</p>
        </div>
      </div>

      <!-- Admin: gestor de cursos -->
      <AdminCoursesManager
        v-if="role === 'Admin'"
        :courses="courses"
        @courses-change="updateCourses"
      />

      <!-- Usuario: lista de cursos accesibles y no accesibles -->
      <UserCoursesList
        v-else
        :courses="courses"
        :current-email="currentEmail"
      />
    </div>
  </div>
  
  <!-- Este es un perfil temporal para desarrollo, debe eliminarse al integrar Firebase -->
</template>

<script>
import AdminCoursesManager from '@/components/AdminCoursesManager.vue'
import UserCoursesList from '@/components/UserCoursesList.vue'

export default {
  name: 'HomeView',
  components: { AdminCoursesManager, UserCoursesList },
  data() {
    return {
      role: 'Usuario',
      currentEmail: '',
      courses: []
    }
  },
  created() {
    // Cargar perfil desde localStorage (temporal para desarrollo)
    const savedRole = localStorage.getItem('dev_role')
    if (savedRole) {
      this.role = savedRole
    }
    const devEmail = localStorage.getItem('dev_email')
    if (devEmail) {
      this.currentEmail = devEmail
    }
    // Cargar cursos (persistidos en localStorage)
    this.loadCourses()
  },
  methods: {
    loadCourses() {
      const stored = localStorage.getItem('courses')
      if (stored) {
        try {
          this.courses = JSON.parse(stored)
        } catch (e) {
          console.error('Error parsing courses from localStorage', e)
          this.seedInitialCourses()
        }
      } else {
        this.seedInitialCourses()
      }
    },
    seedInitialCourses() {
      // Estructura preparada para futura migración a Firebase
      this.courses = [
        { id: 'c1', code: 'CUR-001', name: 'HTML y CSS', status: 'disponible', price: 0, duration: '8h', description: 'Fundamentos del maquetado web.', cupos: 30, inscritos: 15, assignedMembers: ['usuario@dev.local'] },
        { id: 'c2', code: 'CUR-002', name: 'JavaScript Avanzado', status: 'en_revision', price: 49, duration: '12h', description: 'Closures, módulos y buenas prácticas.', cupos: 25, inscritos: 20, assignedMembers: [] },
        { id: 'c3', code: 'CUR-003', name: 'Vue 3 con Composition API', status: 'disponible', price: 59, duration: '10h', description: 'Construye SPA modernas con Vue.', cupos: 40, inscritos: 32, assignedMembers: ['usuario@dev.local', 'admin@dev.local'] },
        { id: 'c4', code: 'CUR-004', name: 'Node.js y Express', status: 'cerrado', price: 69, duration: '14h', description: 'APIs REST y servidores eficientes.', cupos: 20, inscritos: 20, assignedMembers: ['admin@dev.local'] },
        { id: 'c5', code: 'CUR-005', name: 'Bases de Datos SQL', status: 'disponible', price: 39, duration: '9h', description: 'Modelado y consultas eficientes.', cupos: 35, inscritos: 10, assignedMembers: [] }
      ]
      this.saveCourses()
    },
    saveCourses() {
      localStorage.setItem('courses', JSON.stringify(this.courses))
    },
    updateCourses(updated) {
      this.courses = updated
      this.saveCourses()
    },
    handleRoleChange() {
      localStorage.setItem('dev_role', this.role)
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gap-2 { gap: 0.5rem; }
</style>