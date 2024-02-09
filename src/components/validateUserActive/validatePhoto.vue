<script>
import { computed, reactive, ref, watch } from "vue";
import { useDisplay } from 'vuetify'
import {userUserStore} from '@/stores/user'
import { userAuthStore } from '@/stores/auth'

export default {
  emits: ['sendData'],
  setup(props, ctx) {
    const dniFrontal = ref(null)
    const dniPosterior = ref(null)
    const base64Frontal = ref()
    const loading = ref(false)
    const userStore = userUserStore()
    const authStore = userAuthStore()
    const fileSend = ref()
    const viewImage = reactive({
      imgview1: null
    })
    const mostrarImg = reactive({
      type: 2,
      img1: null,
      img2: null,
    })
    const errorImgs = reactive({
      img1: false
    })
    
    const createBase64ImageF = (event) => {
      const file = event.target.files
      fileSend.value = file[0]
      base64Frontal.value = file[0]
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = () => {
        const base64 =  reader.result
        viewImage.imgview1 = base64.split(',')[1]
        errorImgs.img1 = false
      }
      reader.onerror = (error) => reject(error)
      sendImageS3()
    }

    const sendImageS3 = async (type) => {
      const formData = new FormData()
      formData.append('file', fileSend.value)
      const result = await userStore.sendImage(formData)
      if(result.success) 
        mostrarImg.img1 = `dni/${authStore.user.dni}/${result.data.Key}`
    }

    const continuar = async () => {
      if(mostrarImg.imgview1 === null) {
        errorImgs.img1 = true
      }

      if(!errorImgs.imgview1 && !errorImgs.img2) {
        loading.value = true
        const result = await userStore.sendValidate(mostrarImg)
        
        if ( result.success) {
          await userStore.stateUser()
          setTimeout(() => {
            loading.value = false
            ctx.emit('sendData')
          }, 3000);
        }
      }
    }

    return { 
      dniFrontal, 
      dniPosterior,
      createBase64ImageF,
      mostrarImg,
      errorImgs,
      continuar,
      loading,
      sendImageS3,
      viewImage
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    responsive () { 
      const mobile = useDisplay()
      return mobile.value
    }
  },
}
</script>


<template>
  <div>
    <div class="text-center cl-title">Validación de Identidad</div>
    <div class="text-center cl-subtitle">Recuerda tener a la mano tu documento de identidad</div>
    <div>
      <v-row>
        <v-col>
          <div class="contn-files">
            <div class="btn-open-files">
              <label for="upload1" :class="errorImgs.img1 ? 'err-img' : ''">Adjunta la foto del lado frontal de tu documento <img src="@/assets/svg/icons/file.svg" alt="cuadors"></label>
              <input type="file" @change="createBase64ImageF" style="display:none" id="upload1" accept="image/png, image/jpeg">
            </div>
            <img src="@/assets/images/dnifrontal.png" alt="" v-if="viewImage.imgview1 === null">
            <img v-else :src="`data:image/png;base64,${viewImage.imgview1}`" alt="" width="370" height="235">
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="text-center">
      <v-btn class="btn-send" :loading="loading" color="#70BA44" :width="!responsive ? `330` : `241`" :height="!responsive ? `70` : `51`" @click="continuar()">Continuar</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cl-title{
  color: #005E81;
  font-size: 36px;
  margin-bottom: 25px;
}

.cl-subtitle{
  color:#0081A2;
  font-size: 20px;
  margin-bottom: 60px;
}

.contn-files {
  text-align: center;
}
.btn-open-files{
  color: #0081A2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  label{
    padding: 18px 29px;
    background: rgb(155, 210, 201, 20%);
    border-radius: 18px;
    display: flex;
    justify-content: center;
    gap: 40px;
    align-items: center;
     &.err-img{
      border: red;
      color: red;
      background: rgb(255, 0, 0, 20%);
      transition: 0.3s ease-in-out;
    }
  }
}

.btn-send{
  font-size: 22px !important;
  text-transform: capitalize !important;
  border-radius: 18px !important;
  margin-top: 90px;
  }
</style>