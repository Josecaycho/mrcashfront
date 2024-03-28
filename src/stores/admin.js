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
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getDataUser (params) {
      try {
        const result = await axios.get(`/api/admin/user/${params}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async updateUser (params) {
      try {
        const result = await axios.post(`/api/admin/user/update`,params)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }  
    },
    async getOrders (params) {
      try {
        const result = await axios.get(`/api/admin/ordenes`, {
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getDataOrden (params) {
      try {
        const result = await axios.get(`/api/admin/orden/${params}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async updateStateOrder (params) {
      try {
        const result = await axios.post(`/api/admin/orden/${params.orderId}/update`,params.body)
        if (result.data.success) {
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