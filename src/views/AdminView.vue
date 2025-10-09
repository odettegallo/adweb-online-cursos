<template>
  <div class="admin-container">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Administración de Cursos</h1>
        <p class="lead text-muted">Gestiona los cursos de la plataforma</p>
      </div>
      
      <div class="row">
        <div class="col-12">
          <div class="alert alert-warning" role="alert">
            <i class="bi bi-gear me-2"></i>
            Esta vista será implementada con la funcionalidad de administración cuando se integre Firebase.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView'
}
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