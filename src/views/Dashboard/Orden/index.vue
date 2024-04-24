<script setup>
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'

const authStore = userAuthStore()
const userStore = userUserStore()
const banks = ref([])
const accounts = ref([])
const newAccounts = ref([])
const formRegister = ref(null)
const initialState = {
  send: '',
  bank: '',
  bankUser: null,
  comision: 0,
  receive: ''
};
const form = reactive({...initialState})
const finalizar = ref(false)
const codigo = ref(null)
const inputRef = ref(null);
const fileSend = ref(null)
const loadinfImage = ref(false)
const loadinfImageConfirm = ref(false)
const loading = ref(false)
const errorImgs = ref(false)
const disabledCalculo = ref(false)
const detailBank = ref('')

import { orderGenerada } from '@/plugins/email/senEmails'

const routeImg = 'https://mrcashassets.s3.amazonaws.com'

onMounted(() => {
  banks.value = authStore.banks
  accounts.value = authStore.user.dataBank
  newAccounts.value = authStore.user.dataBank
})


const calculate = (type) => {
  if(type === 1) {
    let calculate = form.send - (Number(form.send * parseFloat(authStore.user.comision)/100).toFixed(1))
    let comision = form.send * parseFloat(authStore.user.comision)/100
    form.comision = isNaN(comision) ? 0 : comision
    form.receive = isNaN(calculate) ? 0 : calculate
  }else {
    let calculate = parseFloat(form.receive) + (form.receive * parseFloat(authStore.user.comision)/100)
    let calculate2 = parseFloat(form.receive) + (calculate * parseFloat(authStore.user.comision)/100) 
    let comision = form.receive * parseFloat(authStore.user.comision)/100
    form.comision = isNaN(comision) ? 0 : comision
    form.send = isNaN(calculate2) ? 0 : calculate2
  }
}

const revertCalculate = () => {
  Object.assign(form, initialState);
  disabledCalculo.value = !disabledCalculo.value
}

const sendRegister	= async () => {
	try {
			const valid = await formRegister.value.validate()
      if(valid.valid){
        loading.value = true
        const result = await userStore.newOrder(form)
        if(result.success) {
          codigo.value = result.data[0].codigo
          loading.value = false
          finalizar.value = true
        }
      }
	} catch (error) {
			loading.value = false
	}
}

const getImage = (img) => {
  return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const numberRules = [
  v => !!v || 'Monto invalido',
  v => /^[0-9]+(\.\d{1,2})?$/.test(v) || 'Solo numeros'
]

const bankRules = [
  v => !!v || 'Campo obligatorio'
]

const bankUserRules = [
  v => !!v || 'Campo obligatorio'
]

const openFile = () => {
  document.getElementById('upload1').click();
}

const sendFile = async (event) => {
  const file = event.target.files
  fileSend.value = file[0]
  errorImgs.value = false
  loadinfImage.value = true
  const formData = new FormData()
  formData.append('file', fileSend.value)
  const result = await userStore.sendImageOrder(formData, codigo.value)
  if(result.success){
    setTimeout(() => {
      loadinfImage.value = false
      loadinfImageConfirm.value = true
    }, 2000);
  }   
}

const finishOrder = async() => {
  if(fileSend.value === null) {
    errorImgs.value = true
  }
  if(!errorImgs.value) {
    loading.value = true
    const result = await userStore.finalyOrder(codigo.value)
    if ( result.success) {
      let date = new Date()
      let iconBank = banks.value.find(item => item.id === form.bank)
      let iconBankSend = accounts.value.find(item => item.id === form.bankUser)
      sendEmail({...form,url: routeImg, codigo: codigo.value, iconBank: iconBank.icon, iconBankSend: iconBankSend, comisionUser: authStore.user.comision, date: formatDateView(date) })
      loading.value = false
      finalizar.value = false
      Object.assign(form, initialState);
    }
  }
}

const formatDateView = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${day}/${month + 1}/${year}`
}

const sendEmail = async (data) => {
  localStorage.setItem('tokenEmail', JSON.stringify('App e0112c26f5836ba7fdcb26b22eb5e2a6-68b0bd1f-7933-4692-a9d9-9d9e5169a87c'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeanvargas0324@proton.me>')
  formData.append('subject', 'Creacion de Nueva Orden')
  formData.append('to', `{"to":"${authStore.user.email}","placeholders":{"firstName":"${authStore.user.apellidos}"}}`)
  formData.append('text', `Se a creado una nueva orden con numero de transaccion ${codigo.value}`)
  formData.append('html', orderGenerada(data))
  userStore.sendEmail(formData)
}

const getFilterAccountUser = async(data) => {
  const newAccountsValue = accounts.value.filter(dl => dl.mrc_bank_id === data.id)
  detailBank.value = data.info
  form.bankUser = null
  if(newAccountsValue.length > 0) {
    newAccounts.value = newAccountsValue
  }else newAccounts.value = accounts.value
}

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Generar nueva orden
      </div>
      <div class="content-generate-orden" v-if="!finalizar">
        <v-form ref="formRegister" class="d-flex align-center justify-center">
          <v-card class="card-content" max-width="500" width="500">
            <v-row>
              <v-col cols="12" md="6" lg="6" class="py-0">
                <div class="w-100 content-input-changes">
                  <label for="" class="color-green">Envías</label>
                  <v-text-field 
                    v-model="form.send"
                    prefix="S/"
                    variant="outlined"
                    label="" 
                    type="number"
                    class="ip-form"
                    @keyup="calculate(1)"
                    :rules="numberRules"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6" lg="6" class="py-0">
                <div class="w-100 content-input-changes">
                  <label for="" class="color-green">Recibes</label>
                  <v-text-field 
                    v-model="form.receive"
                    prefix="S/"
                    variant="outlined" 
                    label="" 
                    class="ip-form"
                    @keyup="calculate(2)"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <div class="w-100 mb-2">
                  <div class="alert-content-comision">
                    <v-row>
                      <v-col cols="8">
                        <div class="color-green comision">Comisión débito y crédito</div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end align-center">
                        <div class="color-blue monto">S/ {{ parseFloat(form.comision).toFixed(2) }}</div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <div class="w-100">
                  <label for="" class="color-green">Banco que realizas la operación</label>
                  <v-select
                    v-model="form.bank"
                    :items="banks"
                    variant="outlined"
                    class="ip-form"
                    :item-title="item => item.name_bank"
                    item-value="id"
                    :rules="bankRules"
                  >
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #title>
                          <div @click="getFilterAccountUser(item.raw)" class="d-flex justify-star align-center"><img width="25" height="25" class="mr-3" :src="getImage(item.raw.icon)" /> {{item.raw.name_bank}}</div>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <div class="w-100">
                  <label for="" class="color-green">Seleccione su numero de cuenta</label>
                  <v-select
                    v-model="form.bankUser"
                    :items="newAccounts"
                    variant="outlined"
                    class="ip-form"
                    :item-title="item => item.alias_account +' - '+ item.number_account"
                    item-value="id"
                    :rules="bankUserRules"
                  >
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #title>
                          <div class="d-flex justify-star align-center"><img width="25" height="25" class="mr-3" :src="getImage(item.raw.bank.icon)" /> {{ `${item.raw.alias_account} - ${item.raw.number_account}`}}</div>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
              </v-col>
            </v-row>
            <div class="w-100 d-flex justify-center align-center mt-8
            
            \">
              <v-btn
                class="btn-send-order"
                color="#70BA44"
                :loading="loading"
                @click="sendRegister"
              >Generar</v-btn>
            </div>
          </v-card>
        </v-form>
      </div>
      <div class="content-generate-orden-finaly" v-else>
        <div class="w-10 d-flex justify-center align-center">
          <div class="content-send">
            Envias: {{ `S/ ${form.send}` }}
          </div>
        </div>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <div class="list-detail-bank">
                <h2 class="mb-5">Sigue los siguientes pasos:</h2>
                <div v-html="detailBank"></div>
              </div>
            </v-col>
            <v-col cols="12" lg="6" class="d-flex justify-center align-center">
              <div class="content-items-file">
                <div class="title-file">Si ya realizaste el pago</div>
                <div class="content-info-file" :class="errorImgs ? 'err-img' : ''" @click="openFile()">
                  <div class="text-center" :class="loadinfImage ? 'loading-image' : ''">
                    <p>{{ loadinfImage ? 'Adjuntando..' : loadinfImageConfirm ? 'Listo' : 'Adjunta tu comprobante de pago' }}</p>
                    <img width="86" src="@/assets/svg/icons/file2.svg" alt="cuadors" v-if="!loadinfImage && !loadinfImageConfirm">
                    <img width="86" src="@/assets/svg/icons/check.svg" alt="cuadors" v-if="loadinfImageConfirm">
                    <input type="file" @change="sendFile" style="display:none" name="file" id="upload1" accept="image/png, image/jpeg">
                    <v-progress-linear
                      v-if="loadinfImage"
                      color="#00ACAC"
                      indeterminate
                      rounded
                      height="6"
                    ></v-progress-linear>
                  </div>
                </div>
                <div class="w-100 d-flex justify-center align-center">
                  <v-btn
                    class="btn-send-order-finish"
                    color="#70BA44"
                    :loading="loading"
                    @click="finishOrder()"
                  >Finalizar Orden</v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss">
.content-generate-orden{
  .v-card{
    box-shadow: none;
    background: transparent;
    .content-input-changes{
      position: relative;
      .icon-revert{
        position: absolute;
        transform: translateX(-50%);
        top: 40px;
        right: 0;
        @media screen and (max-width: 1024px){
          top: 30px;
        }
      }
    }
    .v-text-field .v-field {
      font-size: 20px;
    }
    .v-field__input, .v-text-field__prefix{
      padding-top: 12px;
      color: #0081A2;
    }
    .alert-content-comision{
      background: rgba(155, 210, 201, 0.2);
      padding: 16px 25px;
      border-radius: 18px;
      font-size: 18px;
    }
    .btn-send-order{
      width: 330px;
      height: 70px;
      border-radius: 18px;
      font-size: 22px;
      text-transform: capitalize;
    }
  }
  &-finaly{
    .btn-send-order-finish{
      margin-top: 40px;
      width: 330px;
      height: 60px;
      border-radius: 18px;
      font-size: 22px;
      text-transform: capitalize;
      @media screen and (max-width: 1024px){
        margin-top: 25px;
      }
    }
  }
}
.content-generate-orden-finaly{
  @media screen and (max-width: 1024px){
    margin-bottom: 100px;
  }
  .content-send{
    min-width: 310px;
    height: 45px;
    color: #fff;
    background: #146489;
    border-radius: 18px;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    @media screen and (max-width: 1024px){
      margin-bottom: 25px;
    }
  }

  .list-detail-bank{
    h2{
      color: #00ACAC;
      font-size: 28px;
      font-weight: 100;
    }

    ul{
      list-style: numeric;
      margin-left: 25px;
      li{
        color: #0085AE;
        font-size: 20px;
        margin-bottom: 10px;
      }
    }
  }
  .title-file{
    color: #0085AE;
    font-size: 20px;
    text-align: center;
    margin-bottom: 30px;
    @media screen and (max-width: 600px){
      color: #00ACAC;
    }
  }
  .content-info-file{
    background: rgba(155, 210, 201, 0.2);
    width: 250px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 18px;
    padding: 10px;
    cursor: pointer;
    @media screen and (max-width: 1024px){
      height: auto;
      width: 100%;
      padding: 10px 30px;
      div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 25px;
        &.loading-image{
          display: block;
        }
        p{
          font-size: 15px;
          margin-bottom: 0;
        }
        img{
          width: 20px;
        }
      }
    }
    &.err-img{
      border: 2px solid red;
      p{
        color: red;
      }
    }
    p{
      font-size: 28px;
      color: #00ACAC;
      line-height: 25px;
      margin-bottom: 20px;
    }
  }
}

.content-items-file{
  display: grid;
  justify-items: center;
}
</style>