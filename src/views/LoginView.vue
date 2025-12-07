<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-3 text-center">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Inicio de sesión
          </h4>

          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Correo</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              <span v-if="!loading">
                <i class="bi bi-door-open me-1"></i> Entrar
              </span>
              <span v-else>Validando...</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Texto de registro -->
      <p class="text-center mt-3">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '../services/authService'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''

      if (!this.email || !this.password) {
        this.error = 'Ingrese correo y contraseña.'
        return
      }

      this.loading = true
      try {
        const user = await login(this.email, this.password)
        const role = user.role ? user.role.toLowerCase() : ''

        if (role === 'admin') {
          this.$router.push('/users')
        } else {
          this.$router.push('/shop')
        }
      } catch (e) {
        this.error = e.message || 'Error al iniciar sesión.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
