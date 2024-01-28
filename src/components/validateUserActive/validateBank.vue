<template>
  <div>
    <v-form ref="formBank">
      <div class="text-center cl-title">Ingrese cuenta bancaria</div>
      <div class="text-center cl-subtitle">Recuerda para poder realizar una nueva operacion debe tener al menos una cuenta ingresada</div>
      <div class="section-banks">
        <v-container>
          <v-row>
            <v-col cols="6">
              <div class="w-100 d-flex justify-center align-center">
                <div>
                  <label for="" class="color-green">Seleccione una entidad financiera</label>
                  <v-select
                    v-model="form1.mrc_bank_id"
                    :items="banks"
                    variant="outlined"
                    class="ip-form"
                    item-title="name"
                    :rules="bankRules"
                    item-value="id"
                  >
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #title>
                          <div class="d-flex justify-star align-center"><img width="25" height="25" class="mr-3" :src="getImage(item.raw.icon)" /> {{item.raw.name}}</div>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="w-100 d-flex justify-center align-center">
                <div>
                  <label for="" class="color-green">Selecciona Tipo de cuenta</label>
                  <v-select
                    v-model="form1.mrc_type_account_id"
                    :items="typeAccounts"
                    variant="outlined"
                    class="ip-form"
                    item-title="name"
                    :rules="typeAccountRules"
                    item-value="id"
                  ></v-select>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="w-100 d-flex justify-center align-center">
                <div>
                  <label for="" class="color-green">Ingrese Numero de cuenta</label>
                  <v-text-field 
                    v-model="form1.alias_account"
                    variant="outlined" 
                    label="" 
                    class="ip-form"
                    :rules="numberRules"
                  ></v-text-field>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="w-100 d-flex justify-center align-center">
                <div>
                  <label for="" class="color-green">Agrégale un alias a tu cuenta</label>
                  <v-text-field 
                    v-model="form1.aliasAccount"
                    variant="outlined" 
                    label="" 
                    class="ip-form"
                    :rules="aliasAccountRules"
                  ></v-text-field>
                </div>
              </div>
            </v-col>
          </v-row>
          <div class="section-type-account">
            <div @click="money = 1, errorMoney = true" :class="money === 1 && errorMoney ? 'type-account active' : !errorMoney ? 'type-account error' : 'type-account' "><v-icon size="17" class="mr-1" v-if="money === 1">mdi-check-circle-outline</v-icon>Soles</div>
            <div @click="money = 2, errorMoney = true" :class="money === 2 && errorMoney ? 'type-account active' : !errorMoney ? 'type-account error' : 'type-account' "><v-icon size="17" class="mr-1" v-if="money === 2">mdi-check-circle-outline</v-icon>Dolares</div>
          </div>
        </v-container> 
      </div>
      <div class="d-flex justify-center align-center mt-7">
        <div>
          <v-checkbox
            v-model="headline"
            color="#61C028"
            :rules="headlineRules"
            :class="`${headline !== null && !headline ? 'rd-pex error' : 'rd-pex'}`"
            hide-details
          >
            <template v-slot:label>
              <div>
                Aceptar <a class="dl-underline" href="" :style="`${headline !== null && !headline ? 'color:red' : 'color:#61C028'}`">Declaro que soy el(la) titular de la cuenta.</a>
              </div>
            </template>
          </v-checkbox>
        </div>
      </div>
      <div class="text-center">
        <v-btn 
          class="btn-send" 
          :loading="loading" 
          color="#70BA44" 
          :width="!responsive ? `330` : `241`" 
          :height="!responsive ? `70` : `51`" 
          @click="continuar"
        >
          Finalizar
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import {userUserStore} from '@/stores/user'

export default {
  setup(props, ctx) {
    const form1 = ref({id: null, mrc_bank_id: null, mrc_type_account_id: null, number_account: '', alias_account: ''})
    const formBank = ref(null)
    const loading = ref(null)
    const userStore = userUserStore()

    const banks = [
      {name: "Banco Internacional del Perú", id: 1, icon: 'interbank'},
      {name: "Banco de Credito del Peru", id: 2, icon: 'bcp'}
    ]
    const typeAccounts = [
      {name: "Ahorro", id: 1},
      {name: "Cuenta Ahorro", id: 2},
      {name: "Cuenta Corriente", id: 3},
    ]
    const money = ref(null)
    const headline = ref(null)
    const errorMoney = ref(true)
        
    const bankRules = [
      v => !!v || 'Seleccionar un banco'
    ]
    const typeAccountRules = [
      v => !!v || 'Seleccionar un tipo de cuenta'
    ]
    const aliasAccountRules = [
      v => !!v || 'Ingrese un alias'
    ]
    const numberRules = [
      v => Number.isInteger(Number(v)) || 'Solo numeros',
      v => !!v || 'Ingresa un numero de cuenta'
    ]
    const headlineRules = [
      v =>!!v || 'Campos obligatorios'
    ]

    const continuar = async () => {
      const valid1 = await formBank.value.validate()
      loading.value = true
      if(valid1.valid) {
        const data = {...form1.value, typeMoney: money.value, accountHolder: headline.value}
        const result = await userStore.sendValidateBank(data)
        if ( result.success) {
          await userStore.stateUser()
          setTimeout(() => {
            loading.value = false
            ctx.emit('sendData')
          }, 3000);
        }
      }else {
        if(headline.value === null || !headline.value) {
          headline.value = false	
        } else headline.value = headline.value
        if(money.value === null || !money.value) {
          errorMoney.value = false
        }else errorMoney.value = true
      }
    }
    const { mobile } = useDisplay()
    const responsive = computed(() => mobile.value)

    const getImage = (img) => {
      return new URL(`../../assets/svg/banks/${img}.svg`, import.meta.url).href
    }

    return {
      form1,
      formBank,
      loading,
      userStore,
      banks,
      typeAccounts,
      money,
      headline,
      errorMoney,
      bankRules,
      typeAccountRules,
      aliasAccountRules,
      numberRules,
      headlineRules,
      responsive,
      getImage,
      continuar
    }
  }
}


</script>

<style lang="scss">

.v-text-field .v-field {	
  border: 1.5px solid $green;
  border-radius: 18px;
  color: $blue;
  font-family: 'Archivo-SemiBold';
  padding-left: 5px;
  height: 54px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: white;
}

.v-input.ip-form{
  width: 330px;
}

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

.color-green{
  color: #00ACAC;
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
  }
}

.rd-pex .v-label{
  font-size: 17px;
  @media screen and (max-width: 600px) {
    font-size: 12.4px;
  }
}
.rd-pex.v-selection-control--dirty .v-selection-control__input .v-icon::before {
  content: "\F0132" !important;
  color: #00ACAC;
}
.rd-pex .v-selection-control--dirty .v-selection-control__input .v-icon::before {
  content: "\F0132" !important;
  color: #00ACAC;
}
.rd-pex .v-selection-control__input .v-icon::before {
  content: "\F0131" !important;
  color: #00ACAC;
}

.rd-pex.error .v-selection-control__input .v-icon::before {
  content: "\F0131" !important;
  color: red;
}
</style>