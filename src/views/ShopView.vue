<template>
    <div>
        <!-- Encabezado de la tienda -->
        <div class="page-header mb-5">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h1 class="mb-0">
                        <i class="bi bi-bag-fill" style="color: #dc143c;"></i> Tienda de Protecciones
                    </h1>
                    <p class="mb-0 mt-2" style="color: rgba(255,255,255,0.8);">
                        <i class="bi bi-shield-check"></i> Protege tu motocicleta con nuestros productos de calidad
                    </p>
                </div>
                <div class="col-md-4 text-md-end">
                    <span class="badge bg-danger" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
                        <i class="bi bi-box-seam me-2"></i>{{ products.length }} Productos
                    </span>
                </div>
            </div>
        </div>

        <!-- Alertas -->
        <div v-if="alert.message" :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            {{ alert.message }}
            <button type="button" class="btn-close" @click="alert.message = ''"></button>
        </div>

        <!-- Grid de productos -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            <div class="col" v-for="product in products" :key="product.id">
                <div class="card h-100" style="cursor: pointer; transition: all 0.3s ease;" @click="openProduct(product)">
                    <div style="position: relative; overflow: hidden;">
                        <img :src="product.imageUrl || defaultImage" class="card-img-top" alt="Imagen producto"
                            style="height: 250px; object-fit: cover;" />
                        <div class="position-absolute top-0 end-0 p-2">
                            <span class="badge bg-danger">
                                <i class="bi bi-lightning-fill me-1"></i>En Stock
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="bi bi-tag-fill" style="color: #dc143c;"></i>
                                <strong>{{ product.brand }}</strong>
                            </small>
                        </div>
                        <div class="mb-3">
                            <span class="badge bg-light text-dark" style="font-size: 0.85rem;">
                                <i class="bi bi-folder-fill me-1"></i>{{ product.category }}
                            </span>
                        </div>
                        <p class="card-text text-muted mb-0" style="font-size: 0.9rem;">
                            <i class="bi bi-box-seam me-1"></i>Stock: <strong>{{ product.stock }}</strong>
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0" style="color: #dc143c;">
                            {{ formatCurrency(product.price) }}
                        </span>
                        <button class="btn btn-sm btn-primary">
                            <i class="bi bi-eye me-1"></i>Ver
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensaje cuando no hay productos -->
        <div v-if="products.length === 0 && !loading" class="alert alert-info text-center py-5">
            <i class="bi bi-inbox" style="font-size: 3rem; color: #dc143c;"></i>
            <h4 class="mt-3">No hay productos disponibles</h4>
            <p>Vuelve más tarde para ver nuestros productos</p>
        </div>

        <!-- Modal detalle de producto -->
        <div class="modal fade" id="productDetailModal" tabindex="-1" aria-hidden="true" ref="productDetailModal">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" v-if="selectedProduct">
                    <div class="modal-header">
                        <div>
                            <h5 class="modal-title">
                                {{ selectedProduct.name }}
                            </h5>
                            <small class="text-muted">
                                <i class="bi bi-shield-check" style="color: #dc143c;"></i>
                                Marca: {{ selectedProduct.brand }}
                            </small>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-5 mb-3 mb-md-0">
                                <img :src="selectedProduct.imageUrl || defaultImage" class="img-fluid rounded"
                                    alt="Imagen producto" style="border: 3px solid #dc143c;" />
                            </div>
                            <div class="col-md-7">
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Categoría</label>
                                    <p class="form-control-plaintext">{{ selectedProduct.category }}</p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Precio</label>
                                    <p class="h4" style="color: #dc143c;">{{ formatCurrency(selectedProduct.price) }}</p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Stock Disponible</label>
                                    <p class="form-control-plaintext">
                                        <span class="badge bg-success">{{ selectedProduct.stock }} unidades</span>
                                    </p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Estado</label>
                                    <p>
                                        <span class="badge"
                                            :class="selectedProduct.state === 'Activo' ? 'bg-success' : 'bg-secondary'"
                                            style="font-size: 0.9rem;">
                                            <i class="bi bi-check-circle me-1"></i>{{ selectedProduct.state }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="background-color: #f8f9fa;">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            :disabled="processingPurchase">
                            <i class="bi bi-x-circle me-1"></i>Cerrar
                        </button>
                        <button type="button" class="btn btn-primary" @click="buyProduct"
                            :disabled="processingPurchase || selectedProduct.state !== 'Activo'">
                            <span v-if="!processingPurchase">
                                <i class="bi bi-cart-check me-1"></i>Comprar
                            </span>
                            <span v-else>
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Procesando...
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

                // 👇 Solo productos activos
                this.products = data.filter((p) => {
                    const state = p.state ? p.state.toString().toLowerCase() : ''
                    return state === 'activo'
                })
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
