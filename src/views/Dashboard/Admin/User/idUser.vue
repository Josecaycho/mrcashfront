<script setup>
import { onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const adminStore = adminAdminStore()
const userStore = userUserStore()
const authStore = userAuthStore()

const dataUser = ref({})
const dataUserStore = ref({})
const route = useRoute()
const disabledEdit = ref(true)
const comissions = ref([])
const formRegister = ref(null)

const errorDni = ref(false)

const states = ref([
  {id: 0, name: "Registrado"},
  {id: 1, name: "Por Validar"},
  {id: 2, name: "Activo"},
  {id: 3, name: "Inactivo"}
])

import { userValidate,userCanceled } from '@/plugins/email/senEmails'

const routeImg = 'https://mrcash-files.s3.amazonaws.com'

onMounted(async() => {
  userStore.stateLoadingGeneral(true)
  await getUser(route.params.userId)
  comissions.value = authStore.comissions
})

const getUser = async (id)  => {
  const result = await adminStore.getDataUser(id)
  if(result.success){
    dataUser.value = result.data
    dataUserStore.value = result.data
    userStore.stateLoadingGeneral(false)
  }
}

const getImage = (img) => {
  return new URL(`../../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const cancelChanges = async (id) => {
  await getUser(route.params.userId)
  disabledEdit.value = true
}

const saveChanges = async () => {
  userStore.stateLoadingGeneral(true)
  const { valid } = await formRegister.value.validate()
  if(valid) {
    const data = {
      nombres: dataUser.value.nombres,
      phone: dataUser.value.phone,
      apellidos: dataUser.value.apellidos,
      comision: dataUser.value.comision,
      email: dataUser.value.email,
      dni: dataUser.value.dni,
      id: dataUser.value.id
    }

    const result = await adminStore.updateUser(data)
    if(result.success) {
      cancelChanges()
      userStore.stateLoadingGeneral(false)
    }else {
      errorDni.value = true
			setTimeout(() => {
				errorDni.value = false
			}, 2000);
      userStore.stateLoadingGeneral(false)
    }
  }
}

const changeStateUser = async (state) => {
  const data = {
    id: dataUser.value.id,
    state
  }
  const result = await adminStore.updateUser(data)
  if(result.success) {
    if(state === 1)
      sendEmailApprobe()
    if(state === 4)
      sendEmailDesaprobe()
    cancelChanges()
  }
}

const sendEmailApprobe = async () => {
  localStorage.setItem('tokenEmail', JSON.stringify('App e0112c26f5836ba7fdcb26b22eb5e2a6-68b0bd1f-7933-4692-a9d9-9d9e5169a87c'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeanvargas0324@proton.me>')
  formData.append('subject', 'Activacion de Cuenta')
  formData.append('to', `{"to":"${dataUser.value.email}","placeholders":{"firstName":"${dataUser.value.apellidos}"}}`)
  formData.append('html', userValidate());
  userStore.sendEmail(formData)
}

const sendEmailDesaprobe = async () => {
  localStorage.setItem('tokenEmail', JSON.stringify('App e0112c26f5836ba7fdcb26b22eb5e2a6-68b0bd1f-7933-4692-a9d9-9d9e5169a87c'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeanvargas0324@proton.me>')
  formData.append('subject', 'Error en Aprovacion de Cuenta')
  formData.append('to', `{"to":"${dataUser.value.email}","placeholders":{"firstName":"${dataUser.value.apellidos}"}}`)
  formData.append('html', userCanceled());
  userStore.sendEmail(formData)
}

const nameRules = [
  v => !!v || 'Nombres obligatorio'
]

const lastNameRules = [
  v => !!v || 'Apellidos obligatorio'
]

const dniRules = [
  v => !!v || 'DNI obligatorio',
  v => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido',
]

const phoneRules = [
  v => !!v || 'Celular obligatorio',
  v => /^[0-9]{9,9}$/.test(v) || 'Ingrese un celular valido',
]

const emailRules = [
	v => !!v || 'Email obligatorio',
	v => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(v) || 'Ingrese Email valido',
]

</script>

<template>
  <div class="cont-mcas cont-mcas-inter cont-info-user">
    <v-container>
      <div class="title-views text-center">
        Detalle de Usuario
      </div>
      <div class="mb-8" v-if="dataUser.id_rol !== 1">
        <div class="d-flex justify-end gap-4">
          <v-btn color="success" v-if="dataUser.state === 1" @click="changeStateUser(2)">Aprobar Usuario</v-btn>
          <v-btn color="red" v-if="dataUser.state === 1" @click="changeStateUser(4)">Desaprobar Usuario</v-btn>
          <v-btn color="red" v-if="(dataUser.state === 2) && disabledEdit" @click="changeStateUser(3)">Bloquear Usuario</v-btn>
          <v-btn color="success" v-if="dataUser.state === 3 || dataUser.state === 4" @click="changeStateUser(2)">Activar Usuario</v-btn>
          <v-btn color="warning" v-if="(dataUser.state === 2) && disabledEdit" @click="disabledEdit = false">Editar Cliente</v-btn>
          <v-btn color="#70BA44" v-if="!disabledEdit" @click="saveChanges()">Guardar</v-btn>
          <v-btn color="red" v-if="!disabledEdit" @click="cancelChanges()">Cancelar</v-btn>
        </div>
      </div>
      <v-form ref="formRegister">
        <div class="mb-8">
          <v-row class="content-title-section">
            <v-col cols="12">
              Informacion del Cliente
            </v-col>
          </v-row>
          <v-row class="content-info-section">
            <v-col cols="6">
              <div v-if="disabledEdit" class="w-100 h-100 d-flex justify-center align-center">
                <span class="title-comission">Comision: <b>{{ `${Number(dataUser.comision)}%` }}</b></span>
              </div>
              <div v-else>
                <label class="color-green">Selecciona Comision</label>
                <v-select
                  v-model="dataUser.comision"
                  :items="comissions"
                  variant="outlined"
                  class="ip-form"
                  :item-title="item => `${Number(item.monto)}%`"
                  item-value="monto"
                >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #title>
                      <div class="d-flex justify-star align-center">{{`${Number(item.raw.monto)}%`}}</div>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="w-100 h-100 d-flex justify-center align-center">
                <div class="state-order modal-order" :class="dataUser.state === 3 ? 'inactivo' : dataUser.state === 2 ? 'activo' : dataUser.state === 1 ? 'por-validar' : dataUser.state === 0 ? 'registrado' : ''">
                  {{ dataUser.state === 3 ? 'Inactivo' : dataUser.state === 2 ? 'Activo' : dataUser.state === 1 ? 'Por Validar' : dataUser.state === 0 ? 'Registrado' : ''}}
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="mb-8">
          <v-row class="content-title-section">
            <v-col cols="12">
              Datos Personales
            </v-col>
          </v-row>
          <v-row class="content-info-section">
            <v-col cols="12" lg="6" md="6" class="pa-5">
              <v-row class="content-info-form">
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">DNI</label>
                  <v-text-field
                    v-model="dataUser.dni"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                    :rules="dniRules" 
                    :error-messages="errorDni ? `DNI existente` : ``"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Correo</label>
                  <v-text-field 
                    v-model="dataUser.email"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                    :rules="emailRules" 
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Nombres</label>
                  <v-text-field 
                    v-model="dataUser.nombres"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                    :rules="nameRules" 
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Apellidos</label>
                  <v-text-field 
                    v-model="dataUser.apellidos"
                    variant="outlined"
                    class="ip-form"
                    :rules="lastNameRules" 
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Telefono</label>
                  <v-text-field 
                    v-model="dataUser.phone"
                    variant="outlined"
                    class="ip-form"
                    :rules="phoneRules" 
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <div class="w-100 h-100 d-flex justify-center align-center">
                <img class="img-perfil" v-if="dataUser.userFile?.photo" :src="`${routeImg}/${dataUser.userFile.photo}`" />
              </div>
            </v-col>
          </v-row>
        </div>
      </v-form>
      <div class="mb-8">
        <v-row class="content-title-section">
          <v-col cols="12">
            Bancos
          </v-col>
        </v-row>
        <v-row class="content-info-section">
          <v-col cols="12" lg="6" md="6" class="pa-5" v-for="(bank, index) in dataUser.userBanks" :key="index">
            <div class="content">
                <label class="content-title">{{ bank.alias_account }}</label>
                <div class="content-info">
                  <v-row >
                    <v-col cols="12" lg="7">
                      <div class="content-info-first">
                        <img width="25" height="25" class="mr-3" :src="getImage(bank.bank.icon)" />
                        <p>{{ bank.bank.name_bank }}</p>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="5">
                      <div class="content-info-first-account d-flex align-center">
                        <p>{{ `${bank.type_money === 1 ? 'Soles': 'Dolares'} - ${bank.typesAccount.account_name}` }}</p>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <div>{{ bank.number_account }}</div>
                    </v-col>
                    <v-col cols="6">
                      <div class="d-flex justify-end align-center">
                        <!-- <v-icon @click="setData(bank)">mdi-pencil-box-outline</v-icon>
                        <v-icon @click="openDeleteData(bank)" v-if="banksUser.length > 1">mdi-delete</v-icon> -->
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
          </v-col>
        </v-row>
      </div>
      <div class="mb-8">
        <v-row class="content-title-section">
          <v-col cols="12">
            Documentos
          </v-col>
        </v-row>
        <v-row class="content-info-section">
          <v-col cols="12" lg="6" md="6" class="pa-5">
            <div class="w-100 d-flex justify-center align-center">
              <img class="img-perfil" v-if="dataUser.userFile?.dni_frontal" :src="`${routeImg}/${dataUser.userFile.dni_frontal}`" />
            </div>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <div class="w-100 d-flex justify-center align-center">
              <img class="img-perfil" v-if="dataUser.userFile?.dnir_later" :src="`${routeImg}/${dataUser.userFile.dnir_later}`" />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>


<style lang="scss">
.cont-info-user{
  .content-title-section {
    font-size: 20px;
    // background: #146489;
    border-radius: 15px;
    color: #fff;
    // margin-bottom: 15px;
    color: #146489;
  }
  .content-info-section{
    border-top: 1px solid #00ACAC;
  }
  .title-comission{
    font-size: 22px;
    color: #00ACAC;
  }
  .content{
      .v-input.ip-form{
        width: 100%;
      }
    &-title{
      color: #00ACAC;
      font-size: 17px;
    }
    &-info{
      margin-top: 20px;
      background: #fff;
      border-radius: 18px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      padding: 25px;
      color: #0081A2;
      font-family: 'Archivo-SemiBold';

      &-add{
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 123px;
        gap: 15px;
        cursor: pointer;
      }

      &-first{
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &-account{
          border-left: 4px solid $blue2;
          padding-left: 25px;
          @media screen and (max-width: 600px) {
            border: none;
            padding: unset;
          }
        }
      }

      &-form{
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

        .section-type-account{
          display: flex ;
          justify-content: center;
          align-items: center;
          gap: 25px;
          margin-top: 60px;
          .type-account{
            cursor: pointer;
            width: 150px;
            height: 38px;
            border-radius: 13.5px;
            color: #70BA44;
            background: #fff;
            box-shadow: rgba(112, 186, 68, 0.3) 0px 19px 38px, rgba(112, 186, 68, 0.22) 0px 15px 12px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active {
              background: #70BA44;
              color: #fff
            }
            &.error {
              border: 1px solid red;
            }
            @media screen and (max-width: 600px) {
              margin: 15px 0;
              width: 100%;
            }
          }
          @media screen and (max-width: 600px) {
            display: inline-block;
            width: 100%;
            margin-top: 30px;
          }
        }
        .btn-add-bank{
          gap: 20px;
          button{
            border-radius: 18px;
            width: 200px;
            @media screen and (max-width: 600px) {
              margin-bottom: 15px;
              margin-top: 15px;
            }
          }
          @media screen and (max-width: 600px) {
            display: inline-block !important;
          }
        }
      }
    }
  }
  .img-perfil{
    width: calc(100% - 40%);
  }
}
</style>