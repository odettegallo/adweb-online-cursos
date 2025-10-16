// EditarCursoView.vue

<template>
  <div class="editar-curso-container">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Editar Curso: {{ courseCache.name || 'Cargando...' }}</h1>
        <p class="lead text-muted">Modifica la información del curso</p>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-8">

          <div v-if="alertMessage" :class="['alert mb-3', alertType]" role="alert">
            {{ alertMessage }}
            <button type="button" class="btn-close" @click="clearAlert" aria-label="Close"></button>
          </div>
          
          <div v-if="loading || !courseCache.id" class="alert alert-info text-center" role="alert">
            Cargando datos del curso...
          </div>
          <div v-else-if="error || !course" class="alert alert-danger" role="alert">
            Curso no encontrado o error de carga: {{ error || 'ID de curso inválido.' }}
          </div>
          
          <div v-else class="card shadow-sm border-0 p-4">
            <form @submit.prevent="updateCourseWithConfirmation">
              <div class="row g-3">
                
                <div class="col-md-3">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" v-model="courseCache.code" required />
                </div>
                <div class="col-md-5">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="courseCache.name" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="courseCache.status" required>
                    <option value="disponible">Disponible</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
                
                <div class="col-md-3">
                  <label class="form-label">Cupos</label>
                  <input type="number" class="form-control" v-model.number="courseCache.cupos" required min="0" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Inscritos</label>
                  <input type="number" class="form-control" v-model.number="courseCache.inscritos" required min="0" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Duración</label>
                  <input type="text" class="form-control" v-model="courseCache.duration" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Costo ($)</label>
                  <input type="number" class="form-control" v-model.number="courseCache.price" required min="0" />
                </div>
                
                <div class="col-12">
                  <label class="form-label">URL de Imagen</label>
                  <input type="text" class="form-control" v-model="courseCache.imageUrl" />
                </div>
                
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="courseCache.description" rows="3" required></textarea>
                </div>
                
                <div class="col-12 text-end mt-4">
                  <button type="button" class="btn btn-secondary me-2" @click="$router.push({ name: 'Admin' })">
                    <i class="bi bi-arrow-left me-1"></i> Volver a Administración
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save me-1"></i> Guardar Cambios
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '@/stores/coursesStore';
import { computed, ref, watchEffect } from 'vue';

export default {
  name: 'EditarCursoView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useCoursesStore();
    
    const courseCache = ref({});
    const courseId = route.params.id;

    const alertMessage = ref('');
    const alertType = ref('');

    // Busca el curso en el store (reactivo)
    const course = computed(() => {
      // Usar getCourses del store
      return store.getCourses.find(c => c.id === courseId); 
    });

    // Carga los datos al iniciar o cuando el curso se actualiza en el store
    watchEffect(() => {
      if (course.value) {
        courseCache.value = JSON.parse(JSON.stringify(course.value)); // Clonar para edición
      }
    });

    const showAlert = (message, type = 'alert-success') => {
      alertMessage.value = message;
      alertType.value = type;
      setTimeout(() => clearAlert(), 5000);
    };
    const clearAlert = () => {
      alertMessage.value = '';
      alertType.value = '';
    };

    // Lógica de Actualización (con Confirmación/Alerta y Redirección)
    const updateCourseWithConfirmation = async () => {
      clearAlert();
      
      const updatedData = {
        // Datos a enviar a Firebase (se excluye el ID y se limpian los datos)
        code: courseCache.value.code.trim(),
        name: courseCache.value.name.trim(),
        imageUrl: courseCache.value.imageUrl.trim(),
        cupos: Number(courseCache.value.cupos) || 0,
        inscritos: Number(courseCache.value.inscritos) || 0,
        duration: courseCache.value.duration.trim(),
        price: Number(courseCache.value.price) || 0,
        description: courseCache.value.description.trim(),
        status: courseCache.value.status,
      };

      const result = await store.updateCourse(courseId, updatedData); // Actualiza en Firebase

      if (result.success) {
        // Requerimiento: Desplegar modal/popup/alert de éxito
        showAlert(`✅ Curso "${courseCache.value.name}" actualizado correctamente. Redirigiendo...`, 'alert-success');
        
        // Requerimiento: Retornar al usuario a la vista de administración automáticamente
        setTimeout(() => {
          router.push({ name: 'Admin' }); 
        }, 1500); 

      } else {
        showAlert(`❌ Error al actualizar curso: ${result.error}`, 'alert-danger');
      }
    };
    
    return {
      courseCache,
      course,
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      updateCourseWithConfirmation,
      alertMessage,
      alertType,
      clearAlert,
    }
  }
}
</script>

<style scoped>
.editar-curso-container {
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