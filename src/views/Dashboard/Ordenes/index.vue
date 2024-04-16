<script setup>
import Loading from '@/components/General/Loading.vue'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
const authStore = userAuthStore()
const userStore = userUserStore()
const loading = ref(false)
const dialog = ref(false)

const idUser = ref(0)
const ordenes = ref([])
const orden = ref({})
const paginationActive = ref(1)
const pagination = ref(0)
const size = ref(3)
const page = ref(0)
const monto = ref('')
const stateOrder = ref(1)
const states = ref([
  {id: 1, name: "Pendiente"},
  {id: 2, name: "Cancelado"},
  {id: 5, name: "Pagado"}
])
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)

const openDateStart = ref(false)
const openDateEnd = ref(false)
const dateStartNew = computed(() => dateStart.value !== null ? formatDateView(dateStart.value) : '');
const dateEndNew = computed(() => dateStart.value !== null ? formatDateView(dateEnd.value) : '')


onMounted(async () => {
  idUser.value = authStore.user.id
  dateStart.value =  new Date(Date.now())
  dateEnd.value =  new Date(Date.now())
  minDate.value = new Date(dateStart.value)
  await listOrders()
})

const listOrders = async () => {
  loading.value = true
  
  const result = await userStore.listOrders({ 
    page: page.value, 
    size: size.value, 
    monto: monto.value, 
    state: stateOrder.value,
    startDate: dateStart.value !== null ? formatDate(dateStart.value) :undefined,
    endDate: dateEnd.value !== null ? formatDate(dateEnd.value) :undefined
  })
  if(result.success) {
    ordenes.value = result.data.rows
    pagination.value = Math.ceil(result.data.count / size.value)
    loading.value = false
  }
}

const searchPagination = (pageIndex) => {
  paginationActive.value = pageIndex
  page.value = pageIndex - 1
  listOrders()
}

const searchMonto = () => {
  listOrders()
}

const searchState = (state) => {
  stateOrder.value = state.id
  listOrders()
}

const getDate = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${day+1}/${month + 1}/${year}`
}

const formatDate = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${year}-${month + 1}-${day}`
}

const openDialog = (data) => {
  orden.value = data
  dialog.value = true
}

const getImage = (img) => {
  return new URL(`../../../assets/svg/banks/${img}-logo.svg`, import.meta.url).href
}

const formatDateView = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${day}/${month + 1}/${year}`
}
const selectDateStart = () => {
  minDate.value = new Date(dateStart.value)
  if(dateEnd.value === null) 
    dateEnd.value = new Date(Date.now())
    listOrders()
}

const selectDateEnd = () => {
  listOrders()
}
</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Ordenes de Pago
      </div>
      <v-row>
        <v-col cols="12" lg="4" md="4">
          <v-text-field 
            variant="outlined"
            label="Buscar"
            class="ip-form inpt-general"
            v-model="monto" 
            @keyup="searchMonto()">
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="8">
          <v-row>
            <v-col cols="12" lg="4">
              <v-select
                v-model="stateOrder"
                :items="states"
                class="ip-form inpt-general"
                label="Estados"
                item-title="name"
                item-value="id"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #title>
                      <div @click="searchState(item.raw)" class="d-flex justify-star align-center">{{ `${item.raw.name}`}}</div>
                    </template>
                  </v-list-item>
                </template>
              </v-select> 
            </v-col>
            <v-col cols="6" lg="4" md="6">
              <v-menu v-model="openDateStart" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="dateStartNew"
                    class="inpt-general"
                    label="Fecha de Inicio"
                    readonly
                    append-inner-icon="mdi-calendar"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateStart"
                  color="primary"
                  format="dd/MM/yyyy"
                  show-adjacent-months
                  hideHeader
                  hideWeekdays
                  @update:model-value="selectDateStart(),openDateStart = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" lg="4" md="6">
              <v-menu v-model="openDateEnd" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="dateEndNew"
                    class="inpt-general"
                    label="Fecha de Fin"
                    readonly
                    append-inner-icon="mdi-calendar"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateEnd"
                  :min="minDate"
                  color="primary"
                  format="dd/MM/yyyy"
                  show-adjacent-months
                  hideHeader
                  hideWeekdays
                  @update:model-value="selectDateEnd(),openDateEnd = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="content-order mt-5" v-if="!loading">
        <div v-if="ordenes.length > 0">
          <v-card class="card-pagos">
            <v-card-text class="pa-0">
              <v-row class="content-order-list">
                <v-col cols="12" lg="4" v-for="(item, i) in ordenes" :key="i">
                  <div class="content-order-list-item">
                    <div class="content-order-list-item-title">
                      <v-row>
                        <v-col cols="12" lg="8" md="8" sm="8" class="d-flex justify-center align-center transaction">
                          Transaccion: <b class="ml-3">{{ item.codigo }}</b>
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="4" class="d-flex justify-end align-center date">
                          {{ getDate(item.create_date) }}
                        </v-col>
                      </v-row>
                    </div>
                    <div class="content-order-list-item-content">
                      <div>
                        <v-row>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="content-order-list-item-content-text green-text">Monto Devuelto</div>
                          </v-col>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="content-order-list-item-content-number blue-text">{{ `S/ ${item.monto_receive}` }}</div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="content-order-list-item-content-text green-text">Monto Enviado</div>
                          </v-col>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="content-order-list-item-content-number blue-text">{{ `S/ ${item.monto_send}` }}</div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="text-center">
                              <div class="green-text comission"> {{ `Comision (${item.percentage}%)` }}</div>
                              <div class="blue-text comission-number">{{ `S/  ${item.monto_comision}` }}</div>
                            </div>
                          </v-col>
                          <v-col cols="6" lg="6" md="6" sm="6" class="d-flex justify-center align-center">
                            <div class="state-order">
                              {{ item.state === 1 || item.state === 2 || item.state === 3 || item.state === 4 ? 'Pendiente' : 'Pagado'}}
                            </div>
                          </v-col>
                        </v-row>
                        <div class="text-center mt-8">
                          <v-btn
                            color="#00ACAC"
                            @click="openDialog(item)"
                          >
                            <template v-slot:prepend>
                              <v-icon >mdi-eye</v-icon>
                            </template>
                            Ver detalle
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <br>
        </div>
      </div>
      <v-row v-else class="mb-6">
        <v-col cols="12" md="4" v-for="item in 3" :key="item">
          <v-skeleton-loader
            class="mx-auto border"
            type="image, article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <!-- <Loading /> -->
      <ul class="pagination-styles">
        <li @click="searchPagination(item)" :class="paginationActive === item ? 'active' : ''" v-for="item in pagination" :key="item">{{ item }}</li>
      </ul>
      <div class="w-100 text-center" v-if="ordenes.length === 0 && !loading">
        <div class="green-text">
          <span>No se encontraron resultados</span>
          <br>
          <router-link :to="`/dashboard/nueva-orden`">
            <v-btn
              outlined
              color="#70BA44"
              class="mt-5"
            >
              Generar Nueva Orden
            </v-btn>
          </router-link>
        </div>
      </div>

    </v-container>
    <v-dialog
      v-model="dialog"
      width="450"
    >
      <v-card class="content-modal-order">
        <v-card-text>
          <div>
            <div>
              <div class="content-order-list-item-title">
                <div class="icon-close" @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                  Close
                </div>
                <v-row>
                  <v-col cols="12" lg="6" md="6" sm="6" class="d-flex justify-center align-center transaction">
                    Transaccion: <b class="ml-3">{{ orden.codigo }}</b>
                  </v-col>
                  <v-col cols="12" lg="6" md="6" sm="6" class="d-flex justify-end align-center date">
                    {{ getDate(orden.create_date) }}
                  </v-col>
                </v-row>
              </div>
              <div class="content-modal-order-info">
                <div class="w-100 d-flex justify-center align-center mt-5 mb-7 text-center">
                  <div>
                    <div class="black-text monto_receive">{{ `S/ ${orden.monto_receive}` }}</div>
                    <div class="grees-text">Monto de devolución</div>
                  </div>
                </div>
                <v-row>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">Monto enviado</div>
                    <div class="black-text">{{ `S/ ${orden.monto_send}` }}</div>
                  </v-col>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">Banco Origen</div>
                    <img width="100" class="mr-3" :src="getImage(orden.bank.icon)" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">{{ `Comision (${orden.percentage}%)` }}</div>
                    <div class="black-text">{{ `S/ ${orden.monto_comision}` }}</div>
                  </v-col>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">Banco Destino</div>
                    <img width="100" class="mr-3" :src="getImage(orden.userBank.bank.icon)" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">N° de cuenta</div>
                    <div class="black-text">{{ orden.number_account }}</div>
                  </v-col>
                  <v-col cols="6" lg="6">
                    <div class="grees-text">Cód. Transferencia</div>
                    <div class="black-text">{{ orden.number_operation }}</div>
                  </v-col>
                </v-row>
                <div class="w-100 d-flex justify-center align-center mt-5">
                  <div class="state-order modal-order">
                    {{ orden.state === 1 || orden.state === 2 || orden.state === 3 || orden.state === 4 ? 'Pendiente' : 'Pagado'}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template> 
<style lang="scss">
.content-order {
  &-list{
    &-item{
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
      border-radius: 0 0 15px 15px;
      &-title{
        background: #00ACAC;
        height: 68px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        color: #fff;
        padding: 24px;
        @media screen and (max-width: 600px) {
          height: auto;
        }
        .transaction{
          @media screen and (max-width: 600px) {
            font-size: 18px;
          } 
        }
        .date{
          @media screen and (max-width: 600px) {
            justify-content: center !important;
            font-size: 18px;
          } 
        }
      }
      &-content{
        padding: 30px;
        background: #fff;
        @media screen and (max-width: 600px) {
          padding: 30px 0 !important;
        }
        .v-row {
          @media screen and (max-width: 600px) {
            margin-bottom: 25px;
          }
        }
        &-text{
          font-size: 15px;
        }
        &-number{
          font-size: 20px;
          @media screen and (max-width: 600px) {
            font-size: 22px;
            font-weight: bold;
          }
        }
        .comission{
          font-size: 12px;
          &-number{
            font-size: 18px;
          }
        }
      }
      button{
        text-transform: capitalize;
      }
    }
  }
}
.ip-form.inpt-general{
  .v-btn--icon.v-btn--density-default{
    background: transparent !important;
  }
}
.pagination-styles{
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  li.active{
    background: #00ACAC;
    border-radius:  50%;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff
  }
}
.green-text{
  color: #00ACAC
}
.blue-text{
  color: #146489;
}
.black-text{
  color: #000;
  font-size: 20px;
}
.grees-text{
  color: #929090;
  font-size: 17px;
}
.state-order{
  height: 31px;
  width: 100px;
  background: #DBD200;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  &.modal-order{
    width: 153px;
    height: 53px;
    font-size: 22px;
  }
}
.content-modal-order{
  border-radius: 15px !important;
  .icon-close{
    position: absolute;
    top: 80px;
    color: white;
    right: 15px;
    background: red;
    padding: 2px 10px;
    font-size: 14px;
    border-radius: 20px;
    cursor: pointer;
  }
  .v-card-text{
    padding: 0 !important;
  }
  &-info{
    padding: 25px;
  }
  .monto_receive{
    font-size: 36px;
  }
}
.card-pagos{
  box-shadow: none !important;
  background: transparent !important;
}
</style>

