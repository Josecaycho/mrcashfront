import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import createPersistedState from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

window.axios = axios
window.axios.defaults.baseURL = import.meta.env.VITE_APP_URL_API
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
window.axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS'
// window.axios.defaults.withCredentials = false

axios.interceptors.request.use(
  (config) => {
    let token = ''
    if(!localStorage.getItem('tokenEmail') && localStorage.getItem('tokenEmail') === null)
      token = localStorage.getItem('token')
      if(token) {
        config.headers['Authorization'] = `Bearer ${token.replace(/['"]+/g, '')}`
      }
    else {
      token = localStorage.getItem('tokenEmail')
      if(token) {
        config.headers['Authorization'] = `${token.replace(/['"]+/g, '')}`
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const pinia = createPinia()
pinia.use(({store}) => {
  store.router = markRaw(router)
})

pinia.use(createPersistedState)
pinia.use(piniaPluginPersistedState)

loadFonts()

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
