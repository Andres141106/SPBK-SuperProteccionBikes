<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-3 text-center">
            <i class="bi bi-person-plus-fill me-2"></i>
            Registro de usuario
          </h4>

          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div v-if="success" class="alert alert-success" role="alert">
            {{ success }}
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Apellido</label>
              <input v-model="lastname" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Correo</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Confirmar contraseña</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-success w-100"
              :disabled="loading"
            >
              <span v-if="!loading">
                <i class="bi bi-person-check-fill me-1"></i> Crear cuenta
              </span>
              <span v-else>Creando cuenta...</span>
            </button>
          </form>

          <p class="text-center mt-3">
            ¿Ya tienes cuenta?
            <router-link to="/login">Inicia sesión</router-link>
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
