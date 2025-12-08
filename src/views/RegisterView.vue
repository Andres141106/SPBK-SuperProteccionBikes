<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center py-4">
    <div class="col-12 col-sm-10 col-md-8 col-lg-6">
      <div class="card shadow-lg">
        <!-- Encabezado con gradiente -->
        <div class="card-header bg-gradient text-white text-center py-4"
             style="background: linear-gradient(135deg, #dc143c 0%, #1a1a1a 100%);">
          <i class="bi bi-person-shield" style="font-size: 2.5rem;"></i>
          <h4 class="mt-3 mb-0">Únete a SPBK</h4>
          <small>Crea tu cuenta de protecciones</small>
        </div>

        <div class="card-body p-4">
          <h5 class="card-title mb-4 text-center">
            <i class="bi bi-person-plus-fill me-2" style="color: #dc143c;"></i>
            Registro de Usuario
          </h5>

          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
            <button type="button" class="btn-close" @click="error = ''"></button>
          </div>
          <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            {{ success }}
            <button type="button" class="btn-close" @click="success = ''"></button>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">
                  <i class="bi bi-person me-1" style="color: #dc143c;"></i>Nombre
                </label>
                <input v-model="name" type="text" class="form-control" placeholder="Juan" required />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">
                  <i class="bi bi-person me-1" style="color: #dc143c;"></i>Apellido
                </label>
                <input v-model="lastname" type="text" class="form-control" placeholder="Pérez" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-envelope me-1" style="color: #dc143c;"></i>Correo Electrónico
              </label>
              <input v-model="email" type="email" class="form-control" placeholder="tu@email.com" required />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">
                  <i class="bi bi-lock me-1" style="color: #dc143c;"></i>Contraseña
                </label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">
                  <i class="bi bi-lock-fill me-1" style="color: #dc143c;"></i>Confirmar Contraseña
                </label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2 mt-3"
              :disabled="loading"
            >
              <span v-if="!loading">
                <i class="bi bi-person-check-fill me-2"></i>Crear Cuenta
              </span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creando cuenta...
              </span>
            </button>
          </form>
        </div>

        <div class="card-footer bg-light text-center py-3">
          <p class="mb-0">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-danger fw-bold" style="text-decoration: none;">
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, createUser } from '../services/userService'

export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      this.success = ''

      if (!this.name || !this.lastname || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'Todos los campos son obligatorios.'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden.'
        return
      }

      this.loading = true
      try {
        // Verificar si el correo ya existe
        const { data: users } = await getUsers()
        const exists = users.some((u) => u.email === this.email)

        if (exists) {
          this.error = 'Ya existe una cuenta con este correo.'
          return
        }

        // Crear usuario con rol fijo "User" y estado "Activo"
        const newUser = {
          name: this.name,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          role: 'User',
          state: 'Activo'
        }

        await createUser(newUser)

        this.success = 'Cuenta creada correctamente. Ahora puede iniciar sesión.'
        // Limpiar campos
        this.name = ''
        this.lastname = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''

        // Opcional: redirigir al login después de un momento
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (e) {
        this.error = 'Error al crear la cuenta.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
