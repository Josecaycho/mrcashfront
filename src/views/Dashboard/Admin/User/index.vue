<script setup>
import { computed, onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'

const adminStore = adminAdminStore()
const authStore = userAuthStore()
const itemsPerPageValue = ref(10)
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const pageIn = ref(0)
const searchText = ref('')
const states = ref([
  {id: null, name: "Todos"},
  {id: 0, name: "Registrado"},
  {id: 1, name: "Por Validar"},
  {id: 2, name: "Activos"},
  {id: 3, name: "Inactivos"}
])
const stateUser = ref()
const comissions = ref([])
const comision = ref('Todos')
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)

const openDateStart = ref(false)
const openDateEnd = ref(false)
const itemsOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' }
]

const headers = [
  {title: 'Nombres', key: 'nombres'},
  {title: 'Apellidos', key: 'apellidos'},
  {title: 'DNI', key: 'dni'},
  {title: 'Comision', key: 'comision'},
  {title: 'Fecha de creacion', key: 'state'},
  {title: 'Estado', key: 'state'},
  {title: 'Acciones'},
]

onMounted(async () => {
  minDate.value = new Date(dateStart.value)
  comissions.value = [{id: 0, monto: "Todos"}, ...JSON.parse(JSON.stringify(authStore.comissions))]
  await getDataUsers()
})

const getDataUsers = async () => {
  loading.value = true
  const result = await adminStore.getUsers({
    size: itemsPerPageValue.value,
    page: pageIn.value,
    text: searchText.value,
    state: stateUser.value,
    comission: comision.value === "Todos" ? null : comision.value,
    startDate: dateStart.value !== null ? formatDate(dateStart.value) :undefined,
    endDate: dateEnd.value !== null ? formatDate(dateEnd.value) :undefined
  })
  if(result.success) {
    users.value = result.data.rows
    totalItems.value = result.data.count
    loading.value = false
  }
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

const searchComission= (value) => {
  comision.value = value.monto
  getDataUsers()
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

const dateStartNew = computed(() => dateStart.value !== null ? formatDateView(dateStart.value) : '');
const dateEndNew = computed(() => dateStart.value !== null ? formatDateView(dateEnd.value) : '')

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Listas de Usuarios
      </div>
      <v-row>
        <v-col cols="12" lg="4" md="12">
          <v-text-field
            label="Buscar"
            class="ip-form style-calendar"
            v-model="searchText" 
            @keyup="getDataUsers()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="12" class="justify-end">
          <v-row no-gutters justify="end">
            <v-col class="px-2" cols="12" lg="3" md="6">
              <v-select
                v-model="stateUser"
                :items="states"
                class="ip-form style-calendar"
                label="Estados"
                item-title="name"
                item-value="id"
                placeholder="Estados"
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
            <v-col class="px-2" cols="12" lg="3" md="6">
              <v-select
                v-model="comision"
                :items="comissions"
                label="Comisiones"
                class="ip-form style-calendar"
                :item-title="item => {
                  if(item.monto === 'Todos') {
                    return 'Todos'
                  }else if(item.monto && item.monto !== 'Todos') {
                    return `${Number(item.monto)}%`
                  }
                }"
                item-value="monto"
                placeholder="Comission"
                return-object
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #title>
                      <div @click="searchComission(item.raw)" class="d-flex justify-star align-center">{{ item.raw.id !== 0 ? `${Number(item.raw.monto)}%` : 'Todos'}}</div>
                    </template>
                  </v-list-item>
                </template>
              </v-select> 
            </v-col>
            <v-col class="px-2" cols="12" lg="3" md="6">
              <v-menu v-model="openDateStart" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="dateStartNew"
                    class="style-calendar"
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
            <v-col class="px-2" cols="12" lg="3" md="6">
              <v-menu v-model="openDateEnd" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-model="dateEndNew"
                    class="style-calendar"
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
          :items-per-page-options="itemsOptions"
          @update:options="loadItems"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.nombres }}</td>
              <td>{{ item.apellidos }}</td>
              <td>{{ item.dni }}</td>
              <td>{{ `${Number(item.comision)}%` }}</td>
              <td>{{ formatDateView(item.creation_date) }}</td>
              <td>
                <div class="state-order modal-order" :class="item.state === 3 ? 'inactivo' : 'activo'">
                  {{ item.state === 3 ? 'Inactivo' : 'Activo' }}
                </div>
              </td>
              <td>
                <div class="d-flex ml-4">
                  <router-link :to="`/dashboard/user/${item.id}`"><v-icon class="mr-2" color="#00ACAC">mdi-eye</v-icon></router-link>
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
.state-order{
  height: 31px;
  width: 100px;
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
</style>