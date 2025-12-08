<template>
  <div>
    <!-- Encabezado de administración -->
    <div class="page-header mb-5">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="mb-0">
            <i class="bi bi-box-seam" style="color: #dc143c;"></i> Gestión de Productos
          </h1>
          <p class="mb-0 mt-2" style="color: rgba(255,255,255,0.8);">
            <i class="bi bi-tools"></i> Administra el catálogo de protecciones
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-primary btn-lg" @click="openCreateModal">
            <i class="bi bi-plus-circle me-2"></i>Nuevo Producto
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

    <!-- Tabla de productos -->
    <div class="card shadow-lg">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">#</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Imagen</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Nombre</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Marca</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Categoría</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Precio</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Stock</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">Estado</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none; text-align: end;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center">
                <td colspan="9" class="py-5">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                  <p class="mt-2 text-muted">Cargando productos...</p>
                </td>
              </tr>
              <tr v-else-if="products.length === 0" class="text-center">
                <td colspan="9" class="py-5">
                  <i class="bi bi-inbox" style="font-size: 2rem; color: #dc143c;"></i>
                  <p class="mt-2 text-muted">No hay productos registrados.</p>
                </td>
              </tr>
              <tr v-else v-for="(product, index) in products" :key="product.id">
                <td class="fw-bold" style="color: #dc143c;">{{ index + 1 }}</td>
                <td>
                  <img
                    :src="product.imageUrl || defaultImage"
                    alt="Imagen producto"
                    class="img-thumbnail rounded"
                    style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #dc143c !important;"
                  />
                </td>
                <td class="fw-bold">{{ product.name }}</td>
                <td>{{ product.brand }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ product.category }}</span>
                </td>
                <td class="fw-bold" style="color: #dc143c;">{{ formatCurrency(product.price) }}</td>
                <td>
                  <span class="badge" :class="product.stock > 0 ? 'bg-success' : 'bg-danger'">
                    {{ product.stock }} unidades
                  </span>
                </td>
                <td>
                  <span class="badge" :class="product.state === 'Activo' ? 'bg-success' : 'bg-secondary'">
                    <i :class="product.state === 'Activo' ? 'bi bi-check-circle me-1' : 'bi bi-x-circle me-1'"></i>
                    {{ product.state }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-primary me-2" @click="openEditModal(product)" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(product)" title="Eliminar">
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
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref="productModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header" style="background: linear-gradient(135deg, #dc143c 0%, #1a1a1a 100%); color: white; border: none;">
              <h5 class="modal-title" id="productModalLabel">
                <i :class="isEditMode ? 'bi bi-pencil-square me-2' : 'bi bi-plus-circle me-2'"></i>
                {{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-box-seam me-1" style="color: #dc143c;"></i>Nombre
                  </label>
                  <input v-model="form.name" type="text" class="form-control" placeholder="Ej: Casco Protector" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-tag-fill me-1" style="color: #dc143c;"></i>Marca
                  </label>
                  <input v-model="form.brand" type="text" class="form-control" placeholder="Ej: BrandX" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-folder-fill me-1" style="color: #dc143c;"></i>Categoría
                  </label>
                  <input v-model="form.category" type="text" class="form-control" placeholder="Ej: Cascos" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-wallet2 me-1" style="color: #dc143c;"></i>Precio (COP)
                  </label>
                  <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="1000"
                    class="form-control"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-box-seam-fill me-1" style="color: #dc143c;"></i>Stock
                  </label>
                  <input
                    v-model="form.stock"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="0"
                    required
                  />
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
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-image me-1" style="color: #dc143c;"></i>URL de Imagen
                </label>
                <input
                  v-model="form.imageUrl"
                  type="url"
                  class="form-control"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <small class="text-muted">
                  Pegue la URL completa de la imagen del producto.
                </small>
              </div>
            </div>
            <div class="modal-footer" style="background-color: #f8f9fa;">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="saving"
              >
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
    <div
      class="modal fade"
      id="deleteProductModal"
      tabindex="-1"
      aria-hidden="true"
      ref="deleteProductModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #f8d7da; border: none;">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>Eliminar Producto
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0">
              ¿Estás seguro de que deseas eliminar el producto
              <strong style="color: #dc143c;">{{ selectedProduct?.name }}</strong>?
            </p>
            <p class="text-muted mt-2 mb-0"><small>Esta acción no se puede deshacer.</small></p>
          </div>
          <div class="modal-footer" style="background-color: #f8f9fa;">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="deleting"
            >
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteProductConfirm"
              :disabled="deleting"
            >
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
    formatCurrency(value) {
      const n = Number(value) || 0
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(n)
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
