<script setup>
import { onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const adminStore = adminAdminStore()
const userStore = userUserStore()
const authStore = userAuthStore()

const dataOrden = ref({})
const dataOrdenStore = ref({})
const route = useRoute()
const disabledEdit = ref(true)
const comissions = ref([])

const states = ref([
  {id: 0, name: "Registrado"},
  {id: 1, name: "Por Validar"},
  {id: 2, name: "Activo"},
  {id: 3, name: "Inactivo"}
])

const routeImg = 'https://mrcash-files.s3.amazonaws.com'

onMounted(async() => {
  await getOrden(route.params.idPago)
  comissions.value = authStore.comissions
})

const getOrden = async (id)  => {
  const result = await adminStore.getDataOrden(id)
  dataOrden.value = result.data
  dataOrdenStore.value = result.data
}

const getImage = (img) => {
  return new URL(`../../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const cancelChanges = async (id) => {
  await getOrden(route.params.userId)
  disabledEdit.value = true
}

// const saveChanges = async () => {
//   const data = {
//     nombres: dataUser.value.nombres,
//     phone: dataUser.value.phone,
//     apellidos: dataUser.value.apellidos,
//     comision: dataUser.value.comision,
//     email: dataUser.value.email,
//     id: dataUser.value.id
//   }

//   const result = await adminStore.updateUser(data)
//   if(result.success) {
//     cancelChanges()
//   }
// }

// const changeStateUser = async (state) => {
//   const data = {
//     id: dataUser.value.id,
//     state
//   }
//   const result = await adminStore.updateUser(data)
//   if(result.success) {
//     cancelChanges()
//   }
// }

</script>

<template>
  <div class="cont-mcas cont-mcas-inter cont-info-user">
    <v-container>
      <div class="title-views text-center">
        Detalle de Pago
      </div>
      <div class="mb-8">
        <div class="d-flex justify-end gap-4">
          <!-- <v-btn color="success" v-if="dataOrden.state === 1" @click="changeStateUser(2)">Aprobar Usuario</v-btn>
          <v-btn color="red" v-if="(dataOrden.state === 1 || dataOrden.state === 2) && disabledEdit" @click="changeStateUser(3)">Bloquear Usuario</v-btn>
          <v-btn color="success" v-if="dataOrden.state === 3" @click="changeStateUser(2)">Activar Usuario</v-btn>
          <v-btn color="warning" v-if="(dataOrden.state === 1 || dataOrden.state === 2) && disabledEdit" @click="disabledEdit = false">Editar Cliente</v-btn>
          <v-btn color="#70BA44" v-if="!disabledEdit" @click="saveChanges()">Guardar</v-btn>
          <v-btn color="red" v-if="!disabledEdit" @click="cancelChanges()">Cancelar</v-btn> -->
        </div>
      </div>
      <div class="mb-8" v-if="dataOrden.user">
        <v-row class="content-title-section">
          <v-col cols="12">
            Datos Personales
          </v-col>
        </v-row>
        <v-row class="content-info-section">
          <v-col cols="12" lg="12" md="12" class="pa-5">
            <v-form ref="formRegister1">
              <v-row class="content-info-form">
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">DNI</label>
                  <v-text-field
                    v-model="dataOrden.user.dni"
                    variant="outlined"
                    class="ip-form"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Correo</label>
                  <v-text-field 
                    v-model="dataOrden.user.email"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Nombres</label>
                  <v-text-field 
                    v-model="dataOrden.user.nombres"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Apellidos</label>
                  <v-text-field 
                    v-model="dataOrden.user.apellidos"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Telefono</label>
                  <v-text-field 
                    v-model="dataOrden.user.phone"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <label class="color-green">Comision</label>
                  <v-text-field 
                    v-model="dataOrden.user.comision"
                    variant="outlined"
                    class="ip-form"
                    :disabled="disabledEdit"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </div>
      <div class="mb-8">
        <v-row class="content-title-section">
          <v-col cols="12">
            Informacion
          </v-col>
        </v-row>
        <v-row class="content-info-section">
          <v-col cols="12" lg="6" md="6" class="pa-5">
            <div class="w-100 d-flex justify-center align-center">
              <div ref="formRegister" class="d-flex align-center justify-center">
                <v-card class="card-content" max-width="500" width="500">
                  <v-row>
                    <v-col cols="12">
                      <div class="w-100 content-input-changes">
                        <label for="" class="color-green">Envías</label>
                        <v-text-field 
                          v-model="dataOrden.monto_send"
                          prefix="S/"
                          variant="outlined"
                          label="" 
                          class="ip-form"
                          disabled=""
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="w-100 content-input-changes">
                        <label for="" class="color-green">Recibes</label>
                        <v-text-field 
                          v-model="dataOrden.monto_receive"
                          prefix="S/"
                          variant="outlined" 
                          label="" 
                          class="ip-form"
                          disabled=""
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="w-100 mb-2">
                        <div class="alert-content-comision">
                          <v-row>
                            <v-col cols="8">
                              <div class="color-green comision">Comisión débito y crédito ({{ `${dataOrden.percentage}%` }})</div>
                            </v-col>
                            <v-col cols="4" class="d-flex justify-end align-center">
                              <div class="color-blue monto">S/ {{ dataOrden.monto_comision }}</div>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" v-if="dataOrden.bankUser">
                      <div class="w-100">
                        <label for="" class="color-green">Banco de la operación</label>
                        <v-text-field 
                          v-model="dataOrden.bankUser.name_bank"
                          variant="outlined"
                          label="" 
                          class="ip-form"
                          disabled=""
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" v-if="dataOrden.bankUser">
                      <div class="w-100">
                        <label for="" class="color-green">Numero de cuenta</label>
                        <v-text-field 
                          v-model="dataOrden.number_account"
                          variant="outlined"
                          label="" 
                          class="ip-form"
                          disabled=""
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <div class="w-100 d-flex justify-center align-center">
              <img class="img-perfil" v-if="dataOrden.img" :src="`${routeImg}/${dataOrden.img}`" />
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
    border: 1px solid #146489;
    border-radius: 20px;
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
  .state-order{
    height: 50px;
    width: 150px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 400;
    &.activo{
      background: #00A24F;
    }
    &.inactivo{
      background: #DBD200;
    }
  }
  .img-perfil{
    width: 80%;
  }
}
</style>