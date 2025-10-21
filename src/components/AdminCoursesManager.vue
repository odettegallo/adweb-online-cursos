// AdminCoursesManager.vue

<template>
  <v-card class="shadow-sm border-0">
    <v-card-text>
      
      <v-alert v-if="alertMessage" :type="alertType.includes('success') ? 'success' : (alertType.includes('danger') ? 'error' : 'info')" variant="tonal" class="mb-3" closable @click:close="clearAlert">
        {{ alertMessage }}
      </v-alert>

      <div class="d-flex flex-wrap align-end gap-3 mb-3">
        <div class="flex-grow-1">
          <label class="form-label mb-1">Búsqueda</label>
          <v-text-field v-model="searchTerm" placeholder="Buscar por código, nombre o descripción" density="comfortable" />
        </div>
        <div style="min-width: 220px;">
          <label class="form-label mb-1">Estado</label>
          <v-select v-model="filterStatus" :items="['', ...statuses]" item-title="" item-value="" density="comfortable" />
        </div>
        <v-btn color="primary" @click="openAddModal" prepend-icon="mdi-plus">
          Agregar Nuevo Curso
        </v-btn>
      </div>

      <v-table class="align-middle">
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
              <v-chip :color="course.status === 'disponible' ? 'success' : 'secondary'" label density="comfortable">{{ course.status }}</v-chip>
            </td>
            <td>{{ currency(course.price) }}</td>
            <td>{{ course.duration }}</td>
            <td>{{ course.cupos }}</td>
            <td>{{ course.inscritos }}</td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <v-chip v-for="m in course.assignedMembers" :key="m" color="primary" label density="comfortable">{{ m }}</v-chip>
              </div>
            </td>
            <td class="text-end">
              <v-btn variant="outlined" color="primary" size="small" class="me-2" @click="editCourseRedirect(course)" icon="mdi-pencil"></v-btn>
              <v-btn variant="outlined" color="error" size="small" @click="confirmDeleteCourse(course)" icon="mdi-delete"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Add Course Dialog -->
      <v-dialog v-model="addModalOpen" max-width="900">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Agregar Nuevo Curso</span>
            <v-btn icon="mdi-close" variant="text" @click="closeAddModal"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="g-3">
              <v-col cols="12" md="2">
                <v-text-field label="Código" v-model="newCourse.code" placeholder="Código" />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field label="Nombre" v-model="newCourse.name" placeholder="Nombre" />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field label="URL de Imagen" v-model="newCourse.imageUrl" placeholder="URL de la imagen" />
              </v-col>

              <v-col cols="12" md="3">
                <v-select label="Estado" v-model="newCourse.status" :items="['disponible','en_revision','cerrado']" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="Cupos" type="number" v-model.number="newCourse.cupos" placeholder="Cupos" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="Inscritos" type="number" v-model.number="newCourse.inscritos" placeholder="Inscritos" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="Duración" v-model="newCourse.duration" placeholder="ej: 10h" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Costo ($)" type="number" v-model.number="newCourse.price" placeholder="Costo" />
              </v-col>

              <v-col cols="12">
                <v-textarea label="Descripción" v-model="newCourse.description" rows="3" placeholder="Descripción" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="secondary" @click="closeAddModal">Cancelar</v-btn>
            <v-btn color="primary" @click="addCourseWithConfirmation" prepend-icon="mdi-plus">Agregar Curso</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCoursesStore } from '@/stores/coursesStore';


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
      addModalOpen: false,
      alertMessage: '',
      alertType: '',
    }
  },
  
  computed: {
    ...mapState(useCoursesStore, {
      allCourses: 'getCourses', //
    }),

    filteredCourses() {
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

    openAddModal() {
      this.clearAlert();
      this.newCourse = { code: '', name: '', status: 'disponible', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' };
      this.addModalOpen = true;
    },
    closeAddModal() {
      this.addModalOpen = false;
    },

    async addCourseWithConfirmation() {
      const confirmAdd = window.confirm(`¿Desea agregar el curso "${this.newCourse.name}" (Costo: ${this.currency(this.newCourse.price)}) a la base de datos?`);

      if (confirmAdd) {
        const courseData = {
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
        
        const result = await this.addCourse(courseData);
        
        if (result.success) {
          this.closeAddModal();
          this.showAlert(`✅ Curso "${this.newCourse.name}" agregado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al agregar curso: ${result.error}`, 'alert-danger');
        }
      }
    },

    editCourseRedirect(course) {
      this.$router.push({ name: 'EditarCurso', params: { id: course.id } });
    },

    async confirmDeleteCourse(course) {
      this.clearAlert();
      
      const confirmDelete = window.confirm(`⚠️ ¿Desea realmente eliminar el curso "${course.name}"?`);
      
      if (confirmDelete) {
        const result = await this.deleteCourse(course.id);
        
        if (result.success) {
          this.showAlert(`✅ Curso "${course.name}" eliminado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al eliminar curso: ${result.error}`, 'alert-danger');
        }
      }
    }
  },

  mounted() {},
};
</script>

<style scoped>
.card { border-radius: 12px; }
.badge { border-radius: 8px; }
</style>