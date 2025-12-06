// src/services/userService.js
import api from './api'

// IMPORTANTE: usamos /Usuarios con U mayúscula
export function getUsers() {
  return api.get('/Usuarios')
}

export function getUser(id) {
  return api.get(`/Usuarios/${id}`)
}

export function createUser(user) {
  return api.post('/Usuarios', user)
}

export function updateUser(id, user) {
  return api.put(`/Usuarios/${id}`, user)
}

export function deleteUser(id) {
  return api.delete(`/Usuarios/${id}`)
}
