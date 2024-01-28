import axios from 'axios'
import { defineStore } from 'pinia';
import { userAuthStore } from '@/stores/auth';

export const userUserStore = defineStore ('user', {
  state: () => ({
		userState: null
	}),
	getters: {
		getStateUser(state) { 
      return state.userState
    }
	},
  actions: {
    async stateUser () {
      try {
        const authStore = userAuthStore();
        const result = await axios.get(`/api/stateUser/${authStore.user.id}`)
        if (result.data.success) {
          this.userState = result.data.data[0].state
          return result.data.data
        }
      } catch (error) {
        
      }    
		},
    async sendValidate (form) {
      try {
        const authStore = userAuthStore()
        const result = await axios.post(`/api/validateDataUser/${authStore.user.id}`, form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    },
    async sendValidateBank (form) {
      try {
        const result = await axios.post(`/api/validateDataBank`, form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    },
    async getListBanksUser (form) {
      try {
        const result = await axios.get(`/api/listBanksUser`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    }, 
    async deleteBankUser (form) {
      try {
        const result = await axios.get(`/api/deleteBankUser/${form}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    }
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
})