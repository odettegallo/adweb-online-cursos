<template>
  <div class="courses-grid">
    <div 
      v-for="course in courses" 
      :key="course.id" 
      class="card clean-course-card h-100" 
      :class="{ 'card-disabled': !isAccessible(course) }"
    >
      
      <div class="card-header bg-gradient-purple border-bottom-0 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-white">{{ course.name }}</h5>
        <span class="text-white-50 small">{{ course.code }}</span>
      </div>

      <div class="card-body d-flex flex-column p-0">
        
        <div class="course-image-container">
            <img :src="course.imageUrl" class="card-img-top course-image" :alt="'Imagen del curso ' + course.name">
        </div>
        
        <div class="p-3 d-flex flex-column flex-grow-1">
            <div class="mb-3">
              <span 
                class="badge status-badge"
                :class="getStatusClass(course.status)"
              >
                <i class="bi bi-tag-fill me-1"></i> {{ getStatusText(course.status) }}
              </span>
            </div>

            <p class="card-text text-muted flex-grow-1">{{ course.description }}</p>
            
            <div class="features-bar mt-auto mb-3 p-2 rounded d-flex justify-content-between align-items-center">
                <div class="text-center">
                    <p class="mb-0 fw-bold text-purple">{{ course.duration }}</p>
                    <small class="text-muted">Duración</small>
                </div>
                <div class="text-center">
                    <p class="mb-0 fw-bold text-success">{{ course.price === 0 ? 'Gratis' : currency(course.price) }}</p>
                    <small class="text-muted">Precio</small>
                </div>
                <div class="text-center">
                    <p class="mb-0 fw-bold text-info">{{ course.cupos - course.inscritos }}</p>
                    <small class="text-muted">Cupos</small>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
              <small v-if="!isAccessible(course)" class="text-danger fw-semibold">No accesible</small>
              <small v-else class="text-success fw-semibold">¡Inscrito!</small>

              <button class="btn btn-sm btn-purple fw-bold text-white" :disabled="!isAccessible(course)">
                <i class="bi bi-play-circle me-1"></i>
                Ir al curso
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCoursesList',
  props: {
    courses: { type: Array, required: true },
    currentEmail: { type: String, required: false, default: '' }
  },
  methods: {
    isAccessible(course) {
      const assigned = Array.isArray(course.assignedMembers) && this.currentEmail
        ? course.assignedMembers.map(s => s.toLowerCase()).includes(this.currentEmail.toLowerCase())
        : false
      return assigned && course.status === 'disponible'
    },
    currency(val) {
      // Usamos el formato chileno por defecto
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(val || 0)
    },
    getStatusClass(status) {
        switch (status) {
            case 'disponible': return 'bg-success text-white';
            case 'en_revision': return 'bg-warning text-dark';
            case 'cerrado': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    },
    getStatusText(status) {
        switch (status) {
            case 'disponible': return 'Disponible';
            case 'en_revision': return 'En Revisión';
            case 'cerrado': return 'Cerrado';
            default: return 'Próximamente';
        }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para este componente */
.clean-course-card {
  border-radius: 12px; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra sutil */
  border: 3px solid #000000;
}
.clean-course-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.course-image-container {
    height: 150px; /* Altura fija para la imagen */
    overflow: hidden; /* Recorta si la imagen es muy grande */
}

.course-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Asegura que la imagen cubra el contenedor sin deformarse */
    border-radius: 0; 
}

.status-badge {
    border-radius: 6px;
    padding: 0.4em 0.8em;
    font-size: 0.9em;
}

.features-bar {
    background-color: #f8f9fa; /* Fondo gris claro para la barra de características */
    border: 1px solid #e9ecef;
}

/* CLASES DE COLOR MORADO */
.btn-purple {
  /* ANTERIORMENTE solo era background-color: #764ba2; */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* <-- EL CAMBIO CLAVE */
  border-color: #764ba2;
  color: white;
}
.btn-purple:hover {
  background-color: #6a4491; /* Sólido oscuro para el hover */
  background-image: none; /* Elimina el gradiente para el hover */
  border-color: #6a4491;
  color: white;
}
.text-purple {
  color: #764ba2 !important;
}

/* NUEVA CLASE: Fondo de Encabezado de Tarjeta con Gradiente */
.bg-gradient-purple {
  /* Usamos el mismo gradiente de tu Navbar */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-bottom: none !important;
}

/* Ajustes a la tarjeta */
.clean-course-card {
  border-radius: 12px; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
}

/* SOLUCIÓN AL PROBLEMA DE ALTURA DESIGUAL */
.clean-course-card .card-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    
    /* CLAVE: Altura mínima para que todos los encabezados sean uniformes. Ajusta este valor. */
    min-height: 70px; 
    
    /* Asegura que el contenido se centre verticalmente */
    display: flex;
    align-items: center; 
}
</style>