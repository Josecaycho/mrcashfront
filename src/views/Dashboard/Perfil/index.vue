<script setup>
import Loading from '@/components/General/Loading.vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'

const routeImg = 'https://mrcash-files.s3.amazonaws.com'

const formRegister1 = ref(null)
const authStore = userAuthStore()
const userStore = userUserStore()
const disabledDNI = ref(true)
const disabled = ref(true)
const dataUser = ref({dniv: '', emailv: '', nombresv: '', apellidosv: ''})

onMounted(() => {
  dataUser.value.dniv = authStore.user.dni
  dataUser.value.emailv = authStore.user.email
  dataUser.value.nombresv = authStore.user.nombres
  dataUser.value.apellidosv = authStore.user.apellidos
})

const editUser = () => {
  disabled.value = false
}


const saveUser = async () => {
  try {
    console.log('sss')
		const valid1 = await formRegister1.value.validate()
    console.log(valid1)
    if (valid1.valid) {
      const result = await authStore.updateDataUser(dataUser.value)
      console.log(result)
      if (result.success) {
        disabled.value = true
        authStore.setUser(result.data[0])
        sendEmail()
      }
    }
  } catch (error) {
      
  }
}

const sendEmail = async () => {
  localStorage.setItem('tokenEmail', JSON.stringify('App 7aa9ecb42803ef00443bf73621d03741-f818b535-0585-4a49-9145-f5093c621211'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeancavar89@gmail.com>')
  formData.append('subject', 'Modificacion de Perfil de usuario')
  formData.append('to', `{"to":"${authStore.user.email}","placeholders":{"firstName":"${authStore.user.apellidos}"}}`)
  formData.append('text', 'Perfil Modificado')
  userStore.sendEmail(formData)
}

const dniRules = [
  v => !!v || 'DNI obligatorio',
  v => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido',
]

const emailRules = [
	v => !!v || 'Email obligatorio',
	v => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(v) || 'Ingrese Email valido',
]

const nameRules = [
  v => !!v || 'Nombres obligatorio'
]

const lastNameRules = [
  v => !!v || 'Apellidos obligatorio'
]

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Datos Personales
      </div>
      <div class="content-perfil d-flex align-center justify-center">
        <v-card class="card-pagos" width="500" height="500">
              <v-form ref="formRegister1">
                <div class="content-info-form pt-5">
                  <v-row class="pt-3">
                    <v-col cols="12">
                      <v-text-field
                        v-model="dataUser.dniv"
                        label="DNI"
                        class="ip-form inpt-general"
                        :disabled="disabledDNI"
                        :rules="dniRules" 
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field 
                        v-model="dataUser.emailv"
                        label="Correo"
                        class="ip-form inpt-general"
                        :rules="emailRules" 
                        :disabled="disabled"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field 
                        v-model="dataUser.nombresv"
                        label="Nombres"
                        class="ip-form inpt-general"
                        :disabled="disabled"
                        :rules="nameRules" 
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field 
                        v-model="dataUser.apellidosv"
                        :rules="lastNameRules"
                        label="Apellidos"
                        class="ip-form inpt-general"
                        :disabled="disabled"
                      ></v-text-field>
                    </v-col>  
                  </v-row>
                </div>
                <div class="content-info-btn">
                  <v-row>
                    <v-col cols="6" lg="6" md="6" v-if="disabled" ><v-btn class="btn-send" height="51" color="#00ACAC" @click="editUser">Editar</v-btn></v-col>
                    <v-col cols="6" lg="6" md="6" v-if="!disabled"><v-btn class="btn-send" height="51" color="#00ACAC" @click="disabled = !disabled">Cancelar</v-btn></v-col>
                    <v-col cols="6" lg="6" md="6" v-if="!disabled"><v-btn class="btn-send" height="51" color="#70BA44" @click="saveUser">Guardar</v-btn></v-col>
                  </v-row>
                </div>
              </v-form>
        </v-card>
      </div>
      <Loading v-if="false"/>
    </v-container>
  </div>
</template>

<style lang="scss">
.v-text-field .v-field {	
  border: 1.5px solid $green;
  border-radius: 18px;
  color: $blue;
  font-family: 'Archivo-SemiBold';
  padding-left: 5px;
  height: 50px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: white;
}

.content-info-btn{
  // display: flex;
  // justify-content: space-between;
  // gap: 20px;
  .btn-send{
    width: 236px;
    height: 70px;
    border-radius: 18px;
    margin-top: 20px;
    @media screen and (max-width: 600px){
      margin-top: 40px;
    }
  }
}
.card-pagos{
  box-shadow: none !important;
  background: transparent !important;
}
</style>