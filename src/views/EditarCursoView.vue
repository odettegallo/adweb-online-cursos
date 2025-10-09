<template>
  <div class="editar-curso-container">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Editar Curso</h1>
        <p class="lead text-muted">Modifica la información del curso</p>
      </div>
      
      <div class="row">
        <div class="col-12">
          <div class="alert alert-info" role="alert">
            <i class="bi bi-pencil me-2"></i>
            Esta vista será implementada con la funcionalidad de edición cuando se integre Firebase.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditarCursoView'
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