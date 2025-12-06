<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>
        <i class="bi bi-box-seam me-2"></i> Gestión de productos
      </h3>
      <button class="btn btn-success" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i> Nuevo producto
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="alert.message" :class="['alert', alert.type]" role="alert">
      {{ alert.message }}
    </div>

    <!-- Tabla de productos -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-4">
                Cargando productos...
              </td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="9" class="text-center py-4">
                No hay productos registrados.
              </td>
            </tr>
            <tr v-else v-for="(product, index) in products" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img
                  :src="product.imageUrl || defaultImage"
                  alt="Imagen producto"
                  class="img-thumbnail"
                  style="width: 60px; height: 60px; object-fit: cover"
                />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.state }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(product)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(product)">
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
      id="productModal"
      tabindex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref="productModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title" id="productModalLabel">
                {{ isEditMode ? 'Editar producto' : 'Nuevo producto' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Marca</label>
                <input v-model="form.brand" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <input v-model="form.category" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input
                  v-model="form.price"
                  type="number"
                  min="0"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input
                  v-model="form.stock"
                  type="number"
                  min="0"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">URL de imagen</label>
                <input
                  v-model="form.imageUrl"
                  type="url"
                  class="form-control"
                  placeholder="https://..."
                />
                <small class="text-muted">
                  Pegue aquí la URL de la imagen del producto.
                </small>
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
      id="deleteProductModal"
      tabindex="-1"
      aria-hidden="true"
      ref="deleteProductModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Seguro que deseas eliminar el producto
            <strong>{{ selectedProduct?.name }}</strong>?
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
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteProductConfirm"
              :disabled="deleting"
            >
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
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService'

export default {
  name: 'ProductsView',
  data() {
    return {
      products: [],
      loading: false,
      saving: false,
      deleting: false,
      isEditMode: false,
      form: {
        id: null,
        name: '',
        brand: '',
        category: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        state: 'Activo'
      },
      selectedProduct: null,
      alert: {
        message: '',
        type: 'alert-info'
      },
      productModalInstance: null,
      deleteModalInstance: null,
      // Imagen por defecto si el producto no tiene URL
      defaultImage: 'https://via.placeholder.com/80x80?text=SPBK'
    }
  },
  mounted() {
    this.fetchProducts()

    this.productModalInstance = new Modal(this.$refs.productModal)
    this.deleteModalInstance = new Modal(this.$refs.deleteProductModal)
  },
  methods: {
    showAlert(message, type = 'alert-success') {
      this.alert.message = message
      this.alert.type = type
      setTimeout(() => {
        this.alert.message = ''
      }, 3000)
    },
    async fetchProducts() {
      this.loading = true
      try {
        const { data } = await getProducts()
        this.products = data
      } catch (e) {
        this.showAlert('Error al cargar productos', 'alert-danger')
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.isEditMode = false
      this.form = {
        id: null,
        name: '',
        brand: '',
        category: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        state: 'Activo'
      }
      this.productModalInstance.show()
    },
    openEditModal(product) {
      this.isEditMode = true
      this.form = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        state: product.state
      }
      this.productModalInstance.show()
    },
    async saveProduct() {
      this.saving = true
      try {
        if (this.isEditMode) {
          await updateProduct(this.form.id, this.form)
          this.showAlert('Producto actualizado correctamente')
        } else {
          await createProduct(this.form)
          this.showAlert('Producto creado correctamente')
        }
        this.productModalInstance.hide()
        this.fetchProducts()
      } catch (e) {
        this.showAlert('Error al guardar producto', 'alert-danger')
      } finally {
        this.saving = false
      }
    },
    confirmDelete(product) {
      this.selectedProduct = product
      this.deleteModalInstance.show()
    },
    async deleteProductConfirm() {
      if (!this.selectedProduct) return
      this.deleting = true
      try {
        await deleteProduct(this.selectedProduct.id)
        this.showAlert('Producto eliminado correctamente')
        this.deleteModalInstance.hide()
        this.fetchProducts()
      } catch (e) {
        this.showAlert('Error al eliminar producto', 'alert-danger')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
