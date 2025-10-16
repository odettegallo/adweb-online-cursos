// AdminView.vue

<template>
  <div class="admin-container">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Administración de Cursos</h1>
        <p class="lead text-muted">Gestiona los cursos de la plataforma</p>
      </div>
      
      <div class="row">
        <div class="col-12">
          
          <div v-if="loading" class="alert alert-info text-center" role="alert">
            <div class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            Cargando cursos desde Firebase en tiempo real...
          </div>

          <div v-else-if="error" class="alert alert-danger" role="alert">
            <i class="bi bi-x-circle me-2"></i>
            Error al cargar cursos: {{ error }}
          </div>
          
          <AdminCoursesManager v-else /> 

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminCoursesManager from '@/components/AdminCoursesManager.vue';
import { useCoursesStore } from '@/stores/coursesStore';
import { onMounted, onUnmounted } from 'vue';


export default {
  name: 'AdminView',
  components: { AdminCoursesManager },

  setup() {
    const coursesStore = useCoursesStore();
    let unsubscribe = null; 

    onMounted(() => {
      // Iniciar la suscripción a cursos (onSnapshot) al montar el componente
      unsubscribe = coursesStore.subscribeToCourses();
    });

    onUnmounted(() => {
      // Desuscribirse cuando el componente se destruye
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return {
      // Se expone el estado para mostrar mensajes de carga y error
      loading: coursesStore.loading, 
      error: coursesStore.error, 
    }
  },
};
</script>

<style scoped>
.admin-container {
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>