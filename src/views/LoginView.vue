<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center py-4">
    <div class="col-12 col-sm-10 col-md-8 col-lg-5">
      <div class="card shadow-lg">
        <!-- Encabezado con gradiente -->
        <div class="card-header bg-gradient text-white text-center py-4" 
             style="background: linear-gradient(135deg, #dc143c 0%, #1a1a1a 100%);">
          <i class="bi bi-shield-check" style="font-size: 2.5rem;"></i>
          <h4 class="mt-3 mb-0">SPBK - Bienvenido</h4>
          <small>Protecciones para Motos</small>
        </div>

        <div class="card-body p-4">
          <h5 class="card-title mb-4 text-center">
            <i class="bi bi-box-arrow-in-right me-2" style="color: #dc143c;"></i>
            Inicia Sesión
          </h5>

          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
            <button type="button" class="btn-close" @click="error = ''"></button>
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">
                <i class="bi bi-envelope me-2" style="color: #dc143c;"></i>Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">
                <i class="bi bi-lock me-2" style="color: #dc143c;"></i>Contraseña
              </label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2"
              :disabled="loading"
            >
              <span v-if="!loading">
                <i class="bi bi-door-open me-2"></i>Entrar
              </span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Validando...
              </span>
            </button>
          </form>
        </div>

        <div class="card-footer bg-light text-center py-3">
          <p class="mb-0">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-danger fw-bold" style="text-decoration: none;">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>
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
