<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import {userUserStore} from '@/stores/user'
import { load } from 'webfontloader';
const userStore = userUserStore()
const { mobile } = useDisplay()
const responsive = computed(() => mobile.value)
const addBank = ref(false)
const form1 = ref({bank: null, typeAccount: null, numberAccount: '', aliasAccount: ''})
const formBank = ref(null)
const loading = ref(null)
const banksUser = [
  {
    id: 1,
    alias_ccount: 'Mi primera cuenta',
    number_account: '3434343434343',
    mrc_bank_id: 1,
    bank: 'Banco Internacional del Perú',
    mrc_type_account_id: 1,
    type_account: 'Ahorros',
    money: 'Soles',
    type_money: 1,
    account_holder: true
  },
  {
    id: 2,
    alias_ccount: 'Mi segunda cuenta',
    number_account: '3434343434343',
    mrc_bank_id: 1,
    bank: 'Banco de Credito del Peru',
    mrc_type_account_id: 2,
    type_account: 'Cuenta corriente',
    money: 'Dolares',
    type_money: 2,
    account_holder: true
  },
  {
    id: 3,
    alias_ccount: 'Mi tercera cuenta',
    number_account: '3434343434343',
    mrc_bank_id: 1,
    bank: 'Banco Internacional del Perú',
    mrc_type_account_id: 1,
    type_account: 'Ahorros',
    money: 'Soles',
    type_money: 1,
    account_holder: true
  }
]

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
      loading.value = false
      addBank.value = false
    }else {
      loading.value = false
    }
  }else {
    loading.value = false
    if(headline.value === null || !headline.value) {
      headline.value = false	
    } else headline.value = headline.value
    if(money.value === null || !money.value) {
      errorMoney.value = false
    }else errorMoney.value = true
  }
}

const getImage = (img) => {
  return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}
</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Cuentas bancarias
      </div>
      <div class="content-">
        <v-row>
          <v-col cols="6" v-for="(bank, i) in banksUser" :key="i">
            <div class="content">
              <label for="" class="content-title">{{ bank.alias_ccount }}</label>
              <div class="content-info">
                <v-row>
                  <v-col cols="7">
                    <div class="content-info-first">
                      <img width="25" height="25" class="mr-3" :src="getImage('bcp')" />
                      <p>{{ bank.bank }}</p>
                    </div>
                  </v-col>
                  <v-col cols="5">
                    <div class="content-info-first-account d-flex justify-end align-center">
                      <p>{{ `${bank.money} - ${bank.type_account}` }}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <div>{{ bank.number_account }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex justify-end align-center">
                      <v-icon>mdi-pencil-box-outline</v-icon>
                      <v-icon>mdi-delete</v-icon>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <label for=""></label>
            <div class="content-info content-info-add" @click="addBank = !addBank">
              <div>Agregar nueva cuenta</div>
              <v-icon>mdi-plus-circle-outline</v-icon>
            </div>
            <div v-if="addBank" class="content-info content-info-form">
              <v-form ref="formBank">
                <div class="section-banks">
                    <v-row>
                      <v-col cols="12">
                        <div class="w-100">
                          <div>
                            <label for="" class="color-green">Seleccione una entidad financiera</label>
                            <v-select
                              v-model="form1.bank"
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
                      <v-col cols="12">
                        <div class="w-100">
                          <div>
                            <label for="" class="color-green">Selecciona Tipo de cuenta</label>
                            <v-select
                              v-model="form1.typeAccount"
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
                      <v-col cols="12">
                        <div class="w-100">
                          <div>
                            <label for="" class="color-green">Ingrese Numero de cuenta</label>
                            <v-text-field 
                              v-model="form1.numberAccount"
                              variant="outlined" 
                              label="" 
                              class="ip-form"
                              :rules="numberRules"
                            ></v-text-field>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <div class="w-100">
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
                          <span class="dl-underline" href="" :style="`${headline !== null && !headline ? 'color:red' : 'color: #0085AE'}`">Declaro que soy el(la) titular de la cuenta.</span>
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </div>
                <div class="btn-add-bank d-flex justify-center align-center text-center">
                  <v-btn 
                    class="btn-send" 
                    color="#0085AE" 
                    :height="!responsive ? `70` : `51`" 
                    @click="continuar"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn 
                    class="btn-send" 
                    :loading="loading" 
                    color="#70BA44" 
                    :height="!responsive ? `70` : `51`" 
                    @click="continuar"
                  >
                    Finalizar
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>


<style lang="scss">
.title-views {
  font-size: 36px;
  font-family: 'Archivo-SemiBold';
  color: $blue2;
  margin-bottom: 60px;
}

.content{
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
        }
      }
      .btn-add-bank{
        gap: 20px;
        button{
          border-radius: 18px;
          width: 200px;
        }
      }
    }
  }
}

</style>