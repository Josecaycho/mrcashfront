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

    const viewImage = reactive({
      imgview1: null,
      imgview2: null
    })

    const fileSend = ref()

    const mostrarImg = reactive({
      type: 1,
      img1: null,
      img2: null
    })
    const errorImgs = reactive({
      img1: false,
      img2: false
    })

    const createBase64ImageF = async (event) => {
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
      sendImageS3(1)
    }

    const createBase64ImageP = (event) => {

      const file = event.target.files
      fileSend.value = file[0]
      base64Frontal.value = file[0]
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = () => {
        const base64 =  reader.result
        viewImage.imgview2 = base64.split(',')[1]
        errorImgs.img2 = false
      }
      reader.onerror = (error) => reject(error)
      sendImageS3(2)
    }

    const sendImageS3 = async (type) => {
      const formData = new FormData()
      formData.append('file', fileSend.value)
      const result = await userStore.sendImage(formData)
      if(result.success) 
        if(type === 1)
          mostrarImg.img1 = `dni/${authStore.user.dni}/${result.data.Key}`
        else mostrarImg.img2 = `dni/${authStore.user.dni}/${result.data.Key}`
    }

    const continuar = async () => {
      if(viewImage.imgview1 === null) {
        errorImgs.img1 = true
      }
      if(viewImage.imgview2 === null) {
        errorImgs.img2 = true
      }
      if(!errorImgs.img1 && !errorImgs.img2) {
        console.log(mostrarImg)
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
      createBase64ImageP,
      mostrarImg,
      errorImgs,
      continuar,
      loading,
      viewImage,
      sendImageS3
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
  <v-container>
    <div class="text-center cl-title">Validación de Identidad</div>
    <div class="text-center cl-subtitle">Recuerda tener a la mano tu documento de identidad</div>
    <div>
      <v-row class="gap-3">
        <v-col class="d-flex justify-center align-center">
          <div class="contn-files">
            <div class="btn-open-files" v-if="viewImage.imgview1 === null" >
              <label for="upload1" :class="errorImgs.img1 ? 'err-img' : ''"><span>Adjunta la foto del lado frontal de tu documento </span><img src="@/assets/svg/icons/file.svg" alt="cuadors"></label>
              <input type="file" @change="createBase64ImageF" style="display:none" name="file" id="upload1" accept="image/png, image/jpeg">
            </div>
            <div class="dlt-image cursor-pointer" @click="viewImage.imgview1 = null" v-if="viewImage.imgview1"> <v-icon color="red">mdi-image-remove</v-icon> Borrar</div>
            <img src="@/assets/images/dnifrontal.png" alt="" v-if="viewImage.imgview1 === null" width="300">
            <img v-else :src="`data:image/png;base64,${viewImage.imgview1}`" alt="" width="300">
          </div>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <div  class="contn-files">
            <div class="btn-open-files" v-if="viewImage.imgview2 === null" >
              <label for="upload2" :class="errorImgs.img2 ? 'err-img' : ''"><span>Adjunta la foto del lado posterior de tu documento</span> <img src="@/assets/svg/icons/file.svg" alt="cuadors"></label>
              <input type="file" @change="createBase64ImageP" style="display:none" name="file2" id="upload2" accept="image/png, image/jpeg">
            </div>
            <div class="dlt-image cursor-pointer" @click="viewImage.imgview2 = null" v-if="viewImage.imgview2"> <v-icon color="red">mdi-image-remove</v-icon> Borrar</div>
            <img src="@/assets/images/dniposterior.png" alt="" v-if="viewImage.imgview2 === null" width="300">
            <img v-else :src="`data:image/png;base64,${viewImage.imgview2}`" alt="" width="300">
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="text-center">
      <v-btn class="btn-send" :loading="loading" color="#70BA44" :width="!responsive ? `330` : `241`" :height="!responsive ? `70` : `51`" @click="continuar()">Continuar</v-btn>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.cl-title{
  color: #005E81;
  font-size: 36px;
  margin-bottom: 10px;
  @media screen and (max-width: 959px) {
    font-size: 30px;
  }
}

.cl-subtitle{
  color:#0081A2;
  font-size: 18px;
  margin-bottom: 50px;
}

.contn-files {
  display: inline-block;
  // flex-wrap: wrap;
  // gap: 25px;
  // align-items: center;
  // justify-content: center;
}

.btn-open-files{
  color: #0081A2;
  display: flex;
  justify-content: center;
  align-items: center;
  label{
    padding: 18px 29px;
    background: rgb(155, 210, 201, 20%);
    border-radius: 18px;
    display: flex;
    justify-content: center;
    gap: 40px;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: 15px;
     &.err-img{
      border: red;
      color: red;
      background: rgb(255, 0, 0, 20%);
      transition: 0.3s ease-in-out;
    }
    @media screen and (max-width: 959px) {
      padding: 10px 20px;
      font-size: 14px;
    }
  }
}

.btn-send{
  font-size: 22px !important;
  text-transform: capitalize !important;
  border-radius: 18px !important;
  margin-top: calc(200px - 13%);
  @media screen and (max-width: 959px) {
    margin-top: 50px
  }
}

.dlt-image{
  color: red;
  font-weight: bold;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>