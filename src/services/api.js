import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://693450ad4090fe3bf01f9acb.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
