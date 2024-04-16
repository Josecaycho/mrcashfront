<script setup>
import { computed, onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'

const adminStore = adminAdminStore()
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const pageIn = ref(0)
const searchTextUser = ref('')
const searchTextOrden = ref('')
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)
const itemsPerPageValue = ref(10)
const itemsOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' }
]

const openDateStart = ref(false)
const openDateEnd = ref(false)
const states = ref([
  {id: null, name: "Todos"},
  {id: 0, name: "No Finalizado"},
  {id: 1, name: "Pendiente"},
  {id: 2, name: "Cancelado"}
])
const stateUser = ref()

const headers = [
  {title: 'Fecha', key: 'fecha'},
  {title: 'Monto', key: 'monto'},
  {title: 'DNI', key: 'dni'},
  {title: 'Cliente', key: 'cliente'},
  {title: 'Nro operacion', key: 'codigo'},
  {title: 'Banco', key: 'banco'},
  {title: 'Estado', key: 'state'},
  {title: 'Acciones'},
]
const getDataUsers = async () => {
  loading.value = true
  const result = await adminStore.getOrders({
    size: itemsPerPageValue.value,
    page: pageIn.value,
    textUser: searchTextUser.value,
    textOrden: searchTextOrden.value,
    state: stateUser.value,
    lst: 'pag',
    startDate: dateStart.value !== null ? formatDate(dateStart.value) :undefined,
    endDate: dateEnd.value !== null ? formatDate(dateEnd.value) :undefined
  })
  if(result.success) {
    users.value = result.data.rows
    totalItems.value = result.data.count
    loading.value = false
  }
}

const selectDateStart = () => {
  minDate.value = new Date(dateStart.value)
  if(dateEnd.value === null) 
    dateEnd.value = new Date(Date.now())
    getDataUsers()
}

const selectDateEnd = () => {
  getDataUsers()
}

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  pageIn.value = page - 1
  itemsPerPageValue.value = itemsPerPage
  getDataUsers()
}

const searchState = (state) => {
  stateUser.value = state.id
  getDataUsers()
}

const formatDateTable = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${day}/${month + 1}/${year}`
}

const formatDate = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${year}-${month + 1}-${day}`
}

const formatDateView = (data) => {
  let dt = new Date(data)
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  return `${day}/${month + 1}/${year}`
}

const getImage = (img) => {
  return new URL(`../../../../assets/svg/banks/${img}-logo.svg`, import.meta.url).href
}

const dateStartNew = computed(() => dateStart.value !== null ? formatDateView(dateStart.value) : '');
const dateEndNew = computed(() => dateStart.value !== null ? formatDateView(dateEnd.value) : '')

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Listas de Pagos
      </div>
      <v-row>
        <v-col cols="12" lg="3" md="3">
          <v-text-field 
            label="Buscar por datos de Usuarios"
            class="ip-form inpt-general"
            v-model="searchTextUser"
            @keyup="getDataUsers()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <v-text-field 
            label="Buscar por datos de Orden"
            class="ip-form inpt-general"
            v-model="searchTextOrden"
            @keyup="getDataUsers()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="6" md="6" class="justify-end">
          <v-row no-gutters>
            <v-col class="ms-md-auto" cols="12" lg="4">
              <v-select
                v-model="stateUser"
                :items="states"
                label="Estados"
                class="ip-form inpt-general"
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
            <v-col class="px-2" cols="12" lg="4" md="6">
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
            <v-col class="px-2" cols="12" lg="4" md="6">
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
      <div class="content-order d-flex align-center justify-center mt-5" >
        <v-data-table-server
          class="cl-table"
          v-model:items-per-page="itemsPerPageValue"
          :headers="headers"
          :items-length="totalItems"
          :items="users"
          :loading="loading"
          item-value="name"
          loading-text="Loading..."
          no-data-text="No se encontraron resultados."
          :items-per-page-options="itemsOptions"
          @update:options="loadItems"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ formatDateTable(item.create_date) }}</td>
              <td>{{ `S/ ${item.monto_send}` }}</td>
              <td>{{ item.user.dni }}</td>
              <td>{{ `${item.user.nombres} ${item.user.apellidos}` }}</td>
              <td>{{ item.codigo }}</td>
              <td>
                <img width="70" height="30" class="mr-3" :src="getImage(item.userBank.bank.icon)" />
              </td>
              <td>
                <div class="state-order modal-order" :class="item.state === 0 ? 'nofinal': item.state === 1 ? 'pendiente' : 'cancelado'">
                  {{ item.state === 0 ? 'No finalizado' : item.state === 1 ? 'Pendiente' : 'Cancelado' }}
                </div>
              </td>
              <td>
                <div class="d-flex ml-4">
                  <router-link :to="`/dashboard/pago/${item.id}`"><v-icon class="mr-2" color="#00ACAC">mdi-eye</v-icon></router-link>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss">
</style>