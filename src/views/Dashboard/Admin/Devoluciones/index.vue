<script setup>
import { onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'

const adminStore = adminAdminStore()
const itemsPerPage = 10
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const size = ref(10)
const pageIn = ref(0)
const searchTextUser = ref('')
const searchTextOrden = ref('')
const states = ref([
  {id: null, name: "Todos"},
  {id: 3, name: "Validado"},
  {id: 4, name: "Observado"}
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
    size: size.value,
    page: pageIn.value,
    textUser: searchTextUser.value,
    textOrden: searchTextOrden.value,
    state: stateUser.value,
    lst: 'devol'
  })
  if(result.success) {
    users.value = result.data.rows
    totalItems.value = result.data.count
    loading.value = false
  }
}

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  pageIn.value = page - 1
  getDataUsers()
}

const searchState = (state) => {
  stateUser.value = state.id
  getDataUsers()
  console.log('srrr')
}

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Listas de Devolucines
      </div>
      <v-row>
        <v-col cols="12" lg="3" md="3">
          <v-text-field 
            label="Buscar por datos de Usuarios"
            class="ip-form style-calendar"
            v-model="searchTextUser"
            @keyup="getDataUsers()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <v-text-field 
            label="Buscar por datos de Orden"
            class="ip-form style-calendar"
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
                class="ip-form style-calendar"
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
          </v-row>
        </v-col>
      </v-row>
      <div class="content-order d-flex align-center justify-center mt-5" >
        <v-data-table-server
          class="cl-table"
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="users"
          :loading="loading"
          item-value="name"
          loading-text="Loading..."
          no-data-text="No se encontraron resultados."
          @update:options="loadItems"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.create_date }}</td>
              <td>{{ `S/ ${item.monto_send}` }}</td>
              <td>{{ item.user.dni }}</td>
              <td>{{ `${item.user.nombres} ${item.user.apellidos}` }}</td>
              <td>{{ item.codigo }}</td>
              <td>{{ item.userBank.bank.icon }}</td>
              <td>
                <div class="state-order modal-order" :class="item.state === 3 ? 'validado' : 'observado'">
                  {{ item.state === 3 ? 'Validado' : 'Observado' }}
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
  &.validado{
    background: #DBD200;
  }
  &.observado{
    background: red;
  }
}
</style>