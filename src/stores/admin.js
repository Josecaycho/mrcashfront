import axios from 'axios'
import { defineStore } from 'pinia';
// import { userAuthStore } from '@/stores/auth';

export const adminAdminStore = defineStore ('admin', {
  state: () => ({
	}),
	getters: {
		
	},
  actions: {
    async getUsers (params) {
      try {
        const result = await axios.get(`/api/admin/users`, {
          params
        })
        if (result.data.success) {
          console.log(result.data)
          return result.data
        }
      } catch (error) {
        
      }   
    }
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  }
})