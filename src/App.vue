<template>
  <div>
    <!-- Navbar principal -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          SPBK - SuperProteccionBikes
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Links visibles solo si está logueado -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isAuthenticated">
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
          </ul>

          <!-- Login / Logout -->
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </router-link>
            </li>
            <li v-else class="nav-item">
              <button class="btn btn-outline-light btn-sm" @click="logout">
                <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido -->
    <main class="container my-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('auth_token')
    }
  },
  created() {
    // Sincroniza al cargar
    this.syncAuth()

    // Cada vez que cambie la ruta, revisa el token otra vez
    this.$watch(
      () => this.$route.fullPath,
      () => {
        this.syncAuth()
      }
    )
  },
  methods: {
    syncAuth() {
      this.isAuthenticated = !!localStorage.getItem('auth_token')
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

