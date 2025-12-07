// src/services/authService.js
import api from './api'

// LOGIN contra MockAPI (endpoint /Usuarios)
export async function login(email, password) {
  const { data: users } = await api.get('/Usuarios')

  const user = users.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  // Bloquear usuarios inactivos
  if (user.state !== 'Activo') {
    throw new Error('El usuario está inactivo. Contacte al administrador.')
  }

  const token = `token-${user.id}-${Date.now()}`

  localStorage.setItem('auth_token', token)
  localStorage.setItem('current_user', JSON.stringify(user))

  return user
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('current_user')
}

// 🔹 ESTA es la función que necesitaba el router
export function getCurrentUser() {
  const json = localStorage.getItem('current_user')
  return json ? JSON.parse(json) : null
}
