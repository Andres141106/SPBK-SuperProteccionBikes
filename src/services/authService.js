import api from './api'

export async function login(email, password) {
  const { data: users } = await api.get('/Usuarios')

  const user = users.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  // 👇 Nueva validación: solo permite usuarios activos
  if (user.state !== 'Activo') {
    throw new Error('El usuario está inactivo. Contacte al administrador.')
  }

  const token = `token-${user.id}-${Date.now()}`

  localStorage.setItem('auth_token', token)
  localStorage.setItem('current_user', JSON.stringify(user))

  return user
}
