<template>
  <div>
    <div class="row g-3">
      <div class="col-md-4" v-for="course in courses" :key="course.id">
        <div class="card h-100 shadow-sm border-0" :class="{ 'card-disabled': !isAccessible(course) }">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">{{ course.name }}</h5>
              <span :class="['badge', course.status === 'disponible' ? 'bg-success' : 'bg-secondary']">{{ course.status }}</span>
            </div>
            <p class="text-muted mb-1"><span class="fw-semibold">Código:</span> {{ course.code }}</p>
            <p class="text-muted mb-1"><span class="fw-semibold">Duración:</span> {{ course.duration }} · <span class="fw-semibold">Precio:</span> {{ currency(course.price) }}</p>
            <p class="card-text text-muted flex-grow-1">{{ course.description }}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <small class="text-muted">Cupos: {{ course.cupos }} · Inscritos: {{ course.inscritos }}</small>
              <button class="btn btn-primary btn-sm" :disabled="!isAccessible(course)">
                <i class="bi bi-play-circle me-1"></i>
                Ir al curso
              </button>
            </div>
            <div v-if="!isAccessible(course)" class="mt-2">
              <span class="text-muted small">No disponible para tu cuenta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}</template>

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
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val || 0)
    }
  }
}
</script>

<style scoped>
.card { border-radius: 12px; }
.card-disabled {
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>