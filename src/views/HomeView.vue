<template>
  <div class="home-container">
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 fw-bold text-gradient mb-1">Inicio</h1>
          <p class="text-dark mb-0">Gestiona y explora los cursos de ADWEB Online</p>
        </div>
      </div>

      <AdminCoursesManager
        v-if="role === 'Admin'"
        :courses="courses"
        @courses-change="updateCourses"
      />

      <UserCoursesList
        v-else
        :courses="courses"
        :current-email="currentEmail"
      />
    </div>
  </div>
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
    // La función ahora devuelve el array de cursos base, no lo asigna a this.courses
    seedInitialCourses() {
      // Estructura preparada para futura migración a Firebase (¡URLs de imagen aquí!)
      return [
        { 
          id: 'c1', code: 'CUR-001', name: 'HTML y CSS', status: 'disponible', price: 0, 
          duration: '8h', description: 'Fundamentos del maquetado web.', cupos: 30, inscritos: 15, 
          assignedMembers: ['usuario@dev.local'],
          imageUrl: 'https://www.gilsys.com/_astro/html-css-logo.C2cnsBrF.png'
        },
        { 
          id: 'c2', code: 'CUR-002', name: 'JavaScript Avanzado', status: 'en_revision', price: 49, 
          duration: '12h', description: 'Closures, módulos y buenas prácticas.', cupos: 25, inscritos: 20, 
          assignedMembers: [],
          imageUrl: 'https://media.licdn.com/dms/image/v2/D4E12AQFfe1nZbaWdMw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1698604163003?e=2147483647&v=beta&t=zrcrB8lfoVmZo0LcSLgut3A_4PwE6YFe9EK3iy17L2Y'
        },
        { 
          id: 'c3', code: 'CUR-003', name: 'Vue 3 con Composition API', status: 'disponible', price: 59, 
          duration: '10h', description: 'Construye SPA modernas con Vue.', cupos: 40, inscritos: 32, 
          assignedMembers: ['usuario@dev.local', 'admin@dev.local'],
          imageUrl: 'https://media.licdn.com/dms/image/v2/C4E12AQFNIzHMgpSTEQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1600742697451?e=2147483647&v=beta&t=-GvDPJXKOJz5cnjhjTR0xvtF22xMCPU3o2ZFUOfXTas'
        },
        { 
          id: 'c4', code: 'CUR-004', name: 'Node.js y Express', status: 'cerrado', price: 69, 
          duration: '14h', description: 'APIs REST y servidores eficientes.', cupos: 20, inscritos: 20, 
          assignedMembers: ['admin@dev.local'],
          imageUrl: 'https://qualitapps.com/wp-content/uploads/2023/02/102.png'
        },
        { 
          id: 'c5', code: 'CUR-005', name: 'Bases de Datos SQL', status: 'disponible', price: 39, 
          duration: '9h', description: 'Modelado y consultas eficientes.', cupos: 35, inscritos: 10, 
          assignedMembers: [],
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png'
        }
      ]
    },
    loadCourses() {
      const stored = localStorage.getItem('courses')
      
      const baseCourses = this.seedInitialCourses()

      if (stored) {
        try {
          const storedCourses = JSON.parse(stored)
          
          const baseMap = baseCourses.reduce((map, course) => {
            map[course.id] = course
            return map
          }, {})
          
          this.courses = storedCourses.map(storedCourse => {
            const baseCourse = baseMap[storedCourse.id] || {}
            
            return {
              ...baseCourse,
              ...storedCourse,
              imageUrl: baseCourse.imageUrl || storedCourse.imageUrl
            }
          })
          
          if (this.courses.length === 0 || this.courses.length !== baseCourses.length) {
              this.courses = baseCourses
              this.saveCourses()
          }

        } catch (e) {
          console.error('Error parsing courses from localStorage', e)
          this.courses = baseCourses
          this.saveCourses()
        }
      } else {
        this.courses = baseCourses
        this.saveCourses()
      }
    },
    saveCourses() {
      // Guardar el estado actual de los cursos en localStorage
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
  /* Mantenemos un fondo limpio */
  background: #f8f9fa; 
}

/* GRADIENTE Y COLOR MORADO */
.text-gradient {
  /* Aplicamos el gradiente morado/púrpura */
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); 
  
  /* CLAVE: Esto hace que el fondo (el gradiente) sea el color del texto */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* TAMAÑO Y FUENTE */
.h3.fw-bold { 
    font-family: 'Impact', sans-serif;
    font-size: 40px;
}

/* --- Estilos para el GRID (Necesario aquí) --- */
.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.gap-2 { gap: 0.5rem; }
</style>