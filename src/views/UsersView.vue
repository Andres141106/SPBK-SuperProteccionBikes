<template>
  <div>
    <!-- Encabezado de administración -->
    <div class="page-header mb-5">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="mb-0">
            <i class="bi bi-people-fill" style="color: #dc143c;"></i> Gestión de Usuarios
          </h1>
          <p class="mb-0 mt-2" style="color: rgba(255,255,255,0.8);">
            <i class="bi bi-shield-lock"></i> Administra los usuarios del sistema
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-primary btn-lg" @click="openCreateModal">
            <i class="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="alert.message" :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']" role="alert">
      <i class="bi bi-info-circle me-2"></i>
      {{ alert.message }}
      <button type="button" class="btn-close" @click="alert.message = ''"></button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="card shadow-lg">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">#</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Nombre</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Apellido</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Correo</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Rol</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Estado</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none; text-align: end;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center">
                <td colspan="7" class="py-5">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                  <p class="mt-2 text-muted">Cargando usuarios...</p>
                </td>
              </tr>
              <tr v-else-if="users.length === 0" class="text-center">
                <td colspan="7" class="py-5">
                  <i class="bi bi-inbox" style="font-size: 2rem; color: #dc143c;"></i>
                  <p class="mt-2 text-muted">No hay usuarios registrados.</p>
                </td>
              </tr>
              <tr v-else v-for="(user, index) in users" :key="user.id">
                <td class="fw-bold" style="color: #dc143c;">{{ index + 1 }}</td>
                <td class="fw-bold">{{ user.name }}</td>
                <td>{{ user.lastname }}</td>
                <td>
                  <i class="bi bi-envelope me-1" style="color: #dc143c;"></i>{{ user.email }}
                </td>
                <td>
                  <span class="badge" :class="user.role === 'Admin' ? 'bg-danger' : 'bg-info'">
                    <i :class="user.role === 'Admin' ? 'bi bi-shield-lock me-1' : 'bi bi-person me-1'"></i>
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.state === 'Activo' ? 'bg-success' : 'bg-secondary'">
                    <i :class="user.state === 'Activo' ? 'bi bi-check-circle me-1' : 'bi bi-x-circle me-1'"></i>
                    {{ user.state }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-primary me-2" @click="openEditModal(user)" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(user)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true"
      ref="userModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveUser">
            <div class="modal-header" style="background: linear-gradient(135deg, #dc143c 0%, #1a1a1a 100%); color: white; border: none;">
              <h5 class="modal-title" id="userModalLabel">
                <i :class="isEditMode ? 'bi bi-pencil-square me-2' : 'bi bi-person-plus-fill me-2'"></i>
                {{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person me-1" style="color: #dc143c;"></i>Nombre
                  </label>
                  <input v-model="form.name" type="text" class="form-control" placeholder="Juan" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person me-1" style="color: #dc143c;"></i>Apellido
                  </label>
                  <input v-model="form.lastname" type="text" class="form-control" placeholder="Pérez" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-envelope me-1" style="color: #dc143c;"></i>Correo Electrónico
                </label>
                <input v-model="form.email" type="email" class="form-control" placeholder="usuario@email.com" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-lock me-1" style="color: #dc143c;"></i>Contraseña
                </label>
                <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" :required="!isEditMode" />
                <small class="text-muted" v-if="isEditMode">
                  <i class="bi bi-info-circle me-1"></i>Deja en blanco para mantener la contraseña actual.
                </small>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-shield-lock me-1" style="color: #dc143c;"></i>Rol
                  </label>
                  <select v-model="form.role" class="form-select" required>
                    <option value="Admin">Admin</option>
                    <option value="User">Usuario</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-power me-1" style="color: #dc143c;"></i>Estado
                  </label>
                  <select v-model="form.state" class="form-select" required>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer" style="background-color: #f8f9fa;">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="saving">
                <i class="bi bi-x-circle me-1"></i>Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="!saving">
                  <i class="bi bi-check-circle me-1"></i>Guardar
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Guardando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal confirmar eliminación -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="deleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #f8d7da; border: none;">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>Eliminar Usuario
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0">
              ¿Estás seguro de que deseas eliminar al usuario
              <strong style="color: #dc143c;">{{ selectedUser?.name }} {{ selectedUser?.lastname }}</strong>?
            </p>
            <p class="text-muted mt-2 mb-0"><small>Esta acción no se puede deshacer.</small></p>
          </div>
          <div class="modal-footer" style="background-color: #f8f9fa;">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="deleting">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteUserConfirm" :disabled="deleting">
              <span v-if="!deleting">
                <i class="bi bi-trash me-1"></i>Eliminar
              </span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Eliminando...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService'

export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: false,
      saving: false,
      deleting: false,
      isEditMode: false,
      form: {
        id: null,
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'User',
        state: 'Activo'
      },

      selectedUser: null,
      alert: {
        message: '',
        type: 'alert-info'
      },
      userModalInstance: null,
      deleteModalInstance: null
    }
  },
  mounted() {
    this.fetchUsers()

    this.userModalInstance = new Modal(this.$refs.userModal)
    this.deleteModalInstance = new Modal(this.$refs.deleteModal)
  },
  methods: {
    showAlert(message, type = 'alert-success') {
      this.alert.message = message
      this.alert.type = type
      setTimeout(() => {
        this.alert.message = ''
      }, 3000)
    },
    async fetchUsers() {
      this.loading = true
      try {
        const { data } = await getUsers()
        this.users = data
      } catch (e) {
        this.showAlert('Error al cargar usuarios', 'alert-danger')
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.isEditMode = false
      this.form = {
        id: null,
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'User',
        state: 'Activo'
      }
      this.userModalInstance.show()
    },

    openEditModal(user) {
      this.isEditMode = true
      this.form = {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: '',
        role: user.role,
        state: user.state
      }
      this.userModalInstance.show()
    },

    async saveUser() {
      this.saving = true
      try {
        if (this.isEditMode) {
          const payload = { ...this.form }
          if (!payload.password) {
            delete payload.password
          }
          await updateUser(this.form.id, payload)
          this.showAlert('Usuario actualizado correctamente')
        } else {
          await createUser(this.form)
          this.showAlert('Usuario creado correctamente')
        }
        this.userModalInstance.hide()
        this.fetchUsers()
      } catch (e) {
        this.showAlert('Error al guardar usuario', 'alert-danger')
      } finally {
        this.saving = false
      }
    },
    confirmDelete(user) {
      this.selectedUser = user
      this.deleteModalInstance.show()
    },
    async deleteUserConfirm() {
      if (!this.selectedUser) return
      this.deleting = true
      try {
        await deleteUser(this.selectedUser.id)
        this.showAlert('Usuario eliminado correctamente')
        this.deleteModalInstance.hide()
        this.fetchUsers()
      } catch (e) {
        this.showAlert('Error al eliminar usuario', 'alert-danger')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
