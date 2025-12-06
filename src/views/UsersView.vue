<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>
        <i class="bi bi-people-fill me-2"></i> Gestión de usuarios
      </h3>
      <button class="btn btn-success" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i> Nuevo usuario
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="alert.message" :class="['alert', alert.type]" role="alert">
      {{ alert.message }}
    </div>

    <!-- Tabla de usuarios -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-4">
                Cargando usuarios...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="text-center py-4">
                No hay usuarios registrados.
              </td>
            </tr>
            <tr v-else v-for="(user, index) in users" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.lastname }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.state }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(user)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(user)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
      ref="userModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveUser">
            <div class="modal-header">
              <h5 class="modal-title" id="userModalLabel">
                {{ isEditMode ? 'Editar usuario' : 'Nuevo usuario' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Apellido</label>
                <input v-model="form.lastname" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Correo</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  :required="!isEditMode"
                />
                <small class="text-muted" v-if="isEditMode">
                  Deja en blanco para mantener la contraseña actual.
                </small>
              </div>
              <div class="mb-3">
                <label class="form-label">Rol</label>
                <input v-model="form.role" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Estado</label>
                <select v-model="form.state" class="form-select" required>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="saving"
              >
                Cerrar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="!saving">Guardar</span>
                <span v-else>Guardando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal confirmar eliminación -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-hidden="true"
      ref="deleteModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar usuario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Seguro que deseas eliminar al usuario
            <strong>{{ selectedUser?.name }} {{ selectedUser?.lastname }}</strong>?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="deleting"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteUserConfirm" :disabled="deleting">
              <span v-if="!deleting">Eliminar</span>
              <span v-else>Eliminando...</span>
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
        role: '',
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
        role: '',
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
