<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>
        <i class="bi bi-bag-fill me-2"></i> Tienda de productos
      </h3>
    </div>

    <!-- Alertas -->
    <div v-if="alert.message" :class="['alert', alert.type]" role="alert">
      {{ alert.message }}
    </div>

    <!-- Grid de productos -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="product in products" :key="product.id">
        <div
          class="card h-100"
          style="cursor: pointer"
          @click="openProduct(product)"
        >
          <img
            :src="product.imageUrl || defaultImage"
            class="card-img-top"
            alt="Imagen producto"
            style="height: 180px; object-fit: cover"
          />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text mb-1">
              <strong>Marca:</strong> {{ product.brand }}
            </p>
            <p class="card-text mb-1">
              <strong>Categoría:</strong> {{ product.category }}
            </p>
          </div>
          <div
            class="card-footer d-flex justify-content-between align-items-center"
          >
            <span class="fw-bold">
              {{ formatCurrency(product.price) }}
            </span>
            <span
              class="badge"
              :class="product.state === 'Activo' ? 'bg-success' : 'bg-secondary'"
            >
              {{ product.state === 'Activo' ? 'Disponible' : 'No disponible' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal detalle de producto -->
    <div
      class="modal fade"
      id="productDetailModal"
      tabindex="-1"
      aria-hidden="true"
      ref="productDetailModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" v-if="selectedProduct">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ selectedProduct.name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body row">
            <div class="col-md-5 mb-3 mb-md-0">
              <img
                :src="selectedProduct.imageUrl || defaultImage"
                class="img-fluid rounded"
                alt="Imagen producto"
              />
            </div>
            <div class="col-md-7">
              <p><strong>Marca:</strong> {{ selectedProduct.brand }}</p>
              <p><strong>Categoría:</strong> {{ selectedProduct.category }}</p>
              <p><strong>Precio:</strong> {{ formatCurrency(selectedProduct.price) }}</p>
              <p><strong>Stock:</strong> {{ selectedProduct.stock }}</p>
              <p>
                <strong>Estado:</strong>
                <span
                  class="badge"
                  :class="selectedProduct.state === 'Activo' ? 'bg-success' : 'bg-secondary'"
                >
                  {{ selectedProduct.state }}
                </span>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="processingPurchase"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="buyProduct"
              :disabled="processingPurchase || selectedProduct.state !== 'Activo'"
            >
              <span v-if="!processingPurchase">
                <i class="bi bi-cart-check me-1"></i> Comprar
              </span>
              <span v-else>Procesando compra...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { getProducts } from '../services/productService'

export default {
  name: 'ShopView',
  data() {
    return {
      products: [],
      loading: false,
      alert: {
        message: '',
        type: 'alert-info'
      },
      selectedProduct: null,
      productDetailModalInstance: null,
      processingPurchase: false,
      defaultImage: 'https://via.placeholder.com/300x200?text=SPBK'
    }
  },
  mounted() {
    this.fetchProducts()
    this.productDetailModalInstance = new Modal(this.$refs.productDetailModal)
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
    openProduct(product) {
      this.selectedProduct = product
      this.productDetailModalInstance.show()
    },
    formatCurrency(value) {
      const n = Number(value) || 0
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(n)
    },
    async buyProduct() {
      if (!this.selectedProduct) return
      this.processingPurchase = true
      try {
        // Aquí podrías hacer lógica real de compra (API, etc.)
        // Por ahora solo simulamos:
        await new Promise((resolve) => setTimeout(resolve, 800))
        this.showAlert(
          `Compra realizada de "${this.selectedProduct.name}" (simulada).`,
          'alert-success'
        )
        this.productDetailModalInstance.hide()
      } catch (e) {
        this.showAlert('Error al procesar la compra', 'alert-danger')
      } finally {
        this.processingPurchase = false
      }
    }
  }
}
</script>
