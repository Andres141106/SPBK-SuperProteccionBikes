<template>
  <div>
    <!-- Navbar principal -->
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#/">
          <i class="bi bi-shield-check me-2"></i>SPBK
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Menú IZQUIERDA -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isAuthenticated">
            <!-- Menú para ADMIN -->
            <template v-if="isAdmin">
              <li class="nav-item">
                <router-link class="nav-link" to="/users">
                  <i class="bi bi-people-fill me-1"></i> Usuarios
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/products">
                  <i class="bi bi-box-seam me-1"></i> Productos
                </router-link>
              </li>
            </template>

            <!-- Menú para USER -->
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/shop">
                  <i class="bi bi-bag-fill me-1"></i> Tienda
                </router-link>
              </li>
            </template>
          </ul>

          <!-- Menú DERECHA -->
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li v-if="!isAuthenticated" class="nav-item me-2">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="btn btn-primary btn-sm" to="/register">
                <i class="bi bi-person-plus me-1"></i> Registrarse
              </router-link>
            </li>
            <li v-else class="nav-item d-flex align-items-center gap-2">
              <span class="navbar-text text-white" v-if="currentUserName">
                <i class="bi bi-person-circle me-1"></i> {{ currentUserName }}
              </span>
              <button class="btn btn-outline-light btn-sm" @click="logout">
                <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido -->
    <main class="container-fluid">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-4 mt-5">
      <div class="container-fluid">
        <p class="mb-2">
          <i class="bi bi-shield-check text-danger"></i>
          <strong>SPBK - Super Protección Bikes</strong>
        </p>
        <p class="mb-0 text-muted">© 2025 Protecciones para Motos. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('auth_token'),
      isAdmin: false,
      currentUserName: ''
    }
  },
  created() {
    this.syncAuth()
    this.$watch(
      () => this.$route.fullPath,
      () => this.syncAuth()
    )
  },
  methods: {
    syncAuth() {
      this.isAuthenticated = !!localStorage.getItem('auth_token')
      const json = localStorage.getItem('current_user')

      if (json) {
        try {
          const user = JSON.parse(json)
          const role = user.role ? user.role.toLowerCase() : ''
          this.isAdmin = role === 'admin'
          this.currentUserName = user.name || user.email || ''
        } catch (e) {
          this.isAdmin = false
          this.currentUserName = ''
        }
      } else {
        this.isAdmin = false
        this.currentUserName = ''
      }
    },
    logout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
      this.syncAuth()
      this.$router.push('/login')
    }
  }
}
</script>
