<template>
  <div class="card shadow-sm border-0">
    <div class="card-body">
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
      </div>

      <div class="border rounded p-3 mb-3 bg-light">
        <h6 class="fw-bold mb-3">Crear nuevo curso</h6>
        <div class="row g-3">
          <div class="col-md-2">
            <input type="text" class="form-control" v-model="newCourse.code" placeholder="Código" />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control" v-model="newCourse.name" placeholder="Nombre" />
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="newCourse.status">
              <option value="">Estado</option>
              <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <input type="number" class="form-control" v-model.number="newCourse.price" placeholder="Precio" />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control" v-model="newCourse.duration" placeholder="Duración (ej: 10h)" />
          </div>
          <div class="col-12">
            <textarea class="form-control" v-model="newCourse.description" rows="2" placeholder="Descripción"></textarea>
          </div>
          <div class="col-md-2">
            <input type="number" class="form-control" v-model.number="newCourse.cupos" placeholder="Cupos" />
          </div>
          <div class="col-md-2">
            <input type="number" class="form-control" v-model.number="newCourse.inscritos" placeholder="Inscritos" />
          </div>
          <div class="col-md-5">
            <input type="text" class="form-control" v-model="newCourse.imageUrl" placeholder="URL de la imagen (opcional)" />
          </div>
          <div class="col-md-3 d-flex justify-content-end">
            <button class="btn btn-primary" @click="addCourse">
              <i class="bi bi-plus-lg me-1"></i>Agregar
            </button>
          </div>
        </div>
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
                <button class="btn btn-outline-primary btn-sm me-2" @click="openEdit(course)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteCourse(course)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal fade" tabindex="-1" ref="editModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar curso</h5>
              <button type="button" class="btn-close" @click="closeEdit"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" v-model="editCache.code" />
                </div>
                <div class="col-md-5">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="editCache.name" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="editCache.status">
                    <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio</label>
                  <input type="number" class="form-control" v-model.number="editCache.price" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Duración</label>
                  <input type="text" class="form-control" v-model="editCache.duration" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Cupos</label>
                  <input type="number" class="form-control" v-model.number="editCache.cupos" />
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="editCache.description" rows="3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">URL de Imagen</label>
                  <input type="text" class="form-control" v-model="editCache.imageUrl" placeholder="URL de la imagen" />
                </div>
              </div>
              <hr />
              <div>
                <label class="form-label">Miembros asignados</label>
                <div class="d-flex gap-2 mb-2">
                  <input type="email" class="form-control" v-model="memberToAdd" placeholder="correo@ejemplo.com" />
                  <button class="btn btn-outline-primary" @click="addMember">
                    <i class="bi bi-person-plus"></i>
                  </button>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="m in editCache.assignedMembers" :key="m" class="badge bg-primary">
                    {{ m }}
                    <button type="button" class="btn btn-sm btn-light ms-2 py-0" @click="removeMember(m)">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeEdit">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="saveEdit">Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  name: 'AdminCoursesManager',
  props: {
    courses: { type: Array, required: true }
  },
  emits: ['courses-change'],
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      statuses: ['disponible', 'cerrado', 'en_revision'],
      newCourse: { code: '', name: '', status: '', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' },
      editCache: { id: '', code: '', name: '', status: 'disponible', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, assignedMembers: [], imageUrl: '' },
      memberToAdd: '',
      editModalInstance: null
    }
  },
  computed: {
    filteredCourses() {
      const term = this.searchTerm.trim().toLowerCase()
      return this.courses.filter(c => {
        const matchesTerm = !term ||
          (c.code && c.code.toLowerCase().includes(term)) ||
          (c.name && c.name.toLowerCase().includes(term)) ||
          (c.description && c.description.toLowerCase().includes(term))
        const matchesStatus = !this.filterStatus || c.status === this.filterStatus
        return matchesTerm && matchesStatus
      })
    }
  },
  mounted() {
    // Inicializar el modal al montar el componente
    this.editModalInstance = new Modal(this.$refs.editModal, {
      backdrop: 'static', 
      keyboard: false
    });
  },
  methods: {
    currency(val) {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(val || 0)
    },
    addCourse() {
      const { code, name, status, price, duration, description, cupos, inscritos, imageUrl } = this.newCourse
      if (!code || !name || !status) return
      const newItem = {
        id: 'c_' + Math.random().toString(36).slice(2, 9),
        code,
        name,
        status,
        price: Number(price) || 0,
        duration,
        description,
        cupos: Number(cupos) || 0,
        inscritos: Number(inscritos) || 0,
        assignedMembers: [],
        imageUrl: imageUrl || 'https://picsum.photos/id/' + (Math.floor(Math.random() * 999) + 1) + '/800/600'
      }
      const updated = [newItem, ...this.courses]
      this.$emit('courses-change', updated)
      this.newCourse = { code: '', name: '', status: '', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' }
    },
    openEdit(course) {
      this.editCache = JSON.parse(JSON.stringify(course))
      this.editModalInstance.show()
    },
    closeEdit() {
      this.editModalInstance.hide()
      this.memberToAdd = ''
    },
    saveEdit() {
      const updated = this.courses.map(c => c.id === this.editCache.id ? { ...c, ...this.editCache } : c)
      this.$emit('courses-change', updated)
      this.closeEdit()
    },
    deleteCourse(course) {
      const updated = this.courses.filter(c => c.id !== course.id)
      this.$emit('courses-change', updated)
    },
    addMember() {
      const email = this.memberToAdd.trim().toLowerCase()
      if (!email) return
      if (!this.editCache.assignedMembers.includes(email)) {
        this.editCache.assignedMembers.push(email)
      }
      this.memberToAdd = ''
    },
    removeMember(email) {
      this.editCache.assignedMembers = this.editCache.assignedMembers.filter(m => m !== email)
    }
  }
}
</script>

<style scoped>
.card { border-radius: 12px; }
.badge { border-radius: 8px; }
</style>