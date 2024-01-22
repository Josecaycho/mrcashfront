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
window.axios.defaults.baseURL = 'http://54.166.130.134:3002'
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
window.axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS'
// window.axios.defaults.withCredentials = false

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if(token) {
      config.headers['Authorization'] = `Bearer ${token.replace(/['"]+/g, '')}`
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
