import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos propios (si quieres luego los usamos)
import './assets/main.css'

createApp(App)
  .use(router)
  .mount('#app')
