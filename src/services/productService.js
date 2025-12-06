// src/services/productService.js
import api from './api'

// IMPORTANTE: usamos /Productos con P mayúscula
export function getProducts() {
  return api.get('/Productos')
}

export function getProduct(id) {
  return api.get(`/Productos/${id}`)
}

export function createProduct(product) {
  return api.post('/Productos', product)
}

export function updateProduct(id, product) {
  return api.put(`/Productos/${id}`, product)
}

export function deleteProduct(id) {
  return api.delete(`/Productos/${id}`)
}
