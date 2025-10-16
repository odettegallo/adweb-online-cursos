// AdminCoursesManager.vue

<template>
  <div class="card shadow-sm border-0">
    <div class="card-body">
      
      <div v-if="alertMessage" :class="['alert mb-3', alertType]" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="clearAlert" aria-label="Close"></button>
      </div>

      <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
        <div class="flex-grow-1">
          <label class="form-label mb-1">Búsqueda</label>
          <input type="text" class="form-control" v-model="searchTerm" placeholder="Buscar por código, nombre o descripción" />
        </div>
        <div style="min-width: 220px;">
          <label class="form-label mb-1">Estado</label>
          <select class="form-select" v-model="filterStatus">
            <option value="">Todos</option>
            <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus-lg me-1"></i>Agregar Nuevo Curso
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Cupos</th>
              <th>Inscritos</th>
              <th>Asignados</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in filteredCourses" :key="course.id">
              <td>{{ course.code }}</td>
              <td>{{ course.name }}</td>
              <td>
                <span :class="['badge', course.status === 'disponible' ? 'bg-success' : 'bg-secondary']">{{ course.status }}</span>
              </td>
              <td>{{ currency(course.price) }}</td>
              <td>{{ course.duration }}</td>
              <td>{{ course.cupos }}</td>
              <td>{{ course.inscritos }}</td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="m in course.assignedMembers" :key="m" class="badge bg-primary">{{ m }}</span>
                </div>
              </td>
              <td class="text-end">
                <button class="btn btn-outline-primary btn-sm me-2" @click="editCourseRedirect(course)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteCourse(course)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal fade" tabindex="-1" ref="addCourseModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Agregar Nuevo Curso</h5>
              <button type="button" class="btn-close" @click="closeAddModal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-2">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" v-model="newCourse.code" placeholder="Código" />
                </div>
                <div class="col-md-5">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="newCourse.name" placeholder="Nombre" />
                </div>
                <div class="col-md-5">
                  <label class="form-label">URL de Imagen</label>
                  <input type="text" class="form-control" v-model="newCourse.imageUrl" placeholder="URL de la imagen" />
                </div>
                
                <div class="col-md-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="newCourse.status">
                    <option value="disponible">Disponible</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Cupos</label>
                  <input type="number" class="form-control" v-model.number="newCourse.cupos" placeholder="Cupos" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Inscritos</label>
                  <input type="number" class="form-control" v-model.number="newCourse.inscritos" placeholder="Inscritos" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Duración</label>
                  <input type="text" class="form-control" v-model="newCourse.duration" placeholder="ej: 10h" />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Costo ($)</label>
                  <input type="number" class="form-control" v-model.number="newCourse.price" placeholder="Costo" />
                </div>
                
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="newCourse.description" rows="3" placeholder="Descripción"></textarea>
                </div>

              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeAddModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="addCourseWithConfirmation">
                <i class="bi bi-plus-lg me-1"></i>Agregar Curso
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCoursesStore } from '@/stores/coursesStore';
import { Modal } from 'bootstrap'; 

export default {
  name: 'AdminCoursesManager',
  
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      statuses: ['disponible', 'en_revision', 'cerrado'],
      newCourse: { 
        code: '', name: '', status: 'disponible', price: 0, 
        duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' 
      },
      addModalInstance: null,
      alertMessage: '',
      alertType: '',
    }
  },
  
  computed: {
    ...mapState(useCoursesStore, {
      allCourses: 'getCourses', //
    }),

    filteredCourses() {
      // Lógica de filtrado de cursos (basada en el contenido original)
      return this.allCourses.filter(course => {
        const matchesSearch = this.searchTerm 
          ? [course.code, course.name, course.description].some(field => 
              field && field.toLowerCase().includes(this.searchTerm.toLowerCase())
            ) 
          : true;
        
        const matchesStatus = this.filterStatus 
          ? course.status === this.filterStatus 
          : true;

        return matchesSearch && matchesStatus;
      });
    }
  },
  
  methods: {
    // Mapear acciones de Pinia (addCourse, deleteCourse, updateCourse)
    ...mapActions(useCoursesStore, ['addCourse', 'deleteCourse']),

    currency(val) {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(val || 0)
    },

    showAlert(message, type = 'alert-success') {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => this.clearAlert(), 5000);
    },
    clearAlert() {
      this.alertMessage = '';
      this.alertType = '';
    },

    // Lógica de Modal de Agregar Curso
    openAddModal() {
      this.clearAlert();
      this.newCourse = { code: '', name: '', status: 'disponible', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' };
      this.addModalInstance.show();
    },
    closeAddModal() {
      this.addModalInstance.hide();
    },

    // Lógica de Agregar Curso (con Confirmación)
    async addCourseWithConfirmation() {
      // Requerimiento: Modal de confirmación para Agregar Curso
      const confirmAdd = window.confirm(`¿Desea agregar el curso "${this.newCourse.name}" (Costo: ${this.currency(this.newCourse.price)}) a la base de datos?`);

      if (confirmAdd) { // Si el usuario presiona "Agregar Curso"
        const courseData = {
          // Se limpian y se validan datos (simplificado)
          code: this.newCourse.code.trim(),
          name: this.newCourse.name.trim(),
          imageUrl: this.newCourse.imageUrl.trim() || 'https://picsum.photos/id/' + (Math.floor(Math.random() * 999) + 1) + '/800/600',
          cupos: Number(this.newCourse.cupos) || 0,
          inscritos: Number(this.newCourse.inscritos) || 0,
          duration: this.newCourse.duration.trim(),
          price: Number(this.newCourse.price) || 0,
          description: this.newCourse.description.trim(),
          status: this.newCourse.status || 'disponible',
          assignedMembers: [],
        };
        
        const result = await this.addCourse(courseData); // Agrega a Firebase
        
        if (result.success) {
          this.closeAddModal(); // Cerrar el modal del formulario
          // onSnapshot en el store actualiza todas las vistas instantáneamente
          this.showAlert(`✅ Curso "${this.newCourse.name}" agregado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al agregar curso: ${result.error}`, 'alert-danger');
        }
      }
      // Si el usuario presiona "Cancelar", el modal deberá desaparecer (o seguir abierto si window.confirm).
    },

    // Lógica de Editar Curso (Redirección)
    editCourseRedirect(course) {
      // Requerimiento: Redirigir a la interfaz de edición
      this.$router.push({ name: 'EditarCurso', params: { id: course.id } });
    },

    // Lógica de Eliminar Curso (con Confirmación)
    async confirmDeleteCourse(course) {
      this.clearAlert();
      
      // Requerimiento: Ventana emergente/Modal de Confirmación
      const confirmDelete = window.confirm(`⚠️ ¿Desea realmente eliminar el curso "${course.name}"?`);
      
      if (confirmDelete) { // Si el usuario presiona "Sí, borrar"
        const result = await this.deleteCourse(course.id); // Eliminar en Firebase
        
        if (result.success) {
          // onSnapshot en el store actualiza todas las vistas instantáneamente
          this.showAlert(`✅ Curso "${course.name}" eliminado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al eliminar curso: ${result.error}`, 'alert-danger');
        }
      }
      // Si el usuario hace clic sobre “Cancelar”, el modal deberá desaparecer (o seguir abierto si window.confirm).
    }
  },

  mounted() {
    // Inicializar el modal de Bootstrap
    this.addModalInstance = new Modal(this.$refs.addCourseModal);
  },
};
</script>

<style scoped>
.card { border-radius: 12px; }
.badge { border-radius: 8px; }
</style>