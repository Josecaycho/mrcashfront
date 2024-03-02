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
const searchText = ref('')
const states = ref([
  {id: null, name: "Todos"},
  {id: 2, name: "Activos"},
  {id: 3, name: "Inactivos"}
])
const stateUser = ref()

const headers = [
  {title: 'Nombres', key: 'nombres'},
  {title: 'Apellidos', key: 'apellidos'},
  {title: 'DNI', key: 'dni'},
  {title: 'Comision', key: 'comision'},
  {title: 'Estado', key: 'state'},
  {title: 'Acciones'},
]

onMounted(() => {
  getDataUsers()
})

const getDataUsers = async () => {
  loading.value = true
  const result = await adminStore.getUsers({
    size: size.value,
    page: pageIn.value,
    text: searchText.value,
    state: stateUser.value
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
}

</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Listas de Usuarios
      </div>
      <v-row>
        <v-col cols="12" lg="4" md="4">
          <v-text-field 
            variant="outlined"
            placeholder="Buscar"
            v-model="searchText" 
            @keyup="getDataUsers()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="8" class="justify-end">
          <v-row no-gutters>
            <v-col class="ms-md-auto" cols="12" lg="4">
              <v-select
                v-model="stateUser"
                :items="states"
                variant="outlined"
                class="ip-form"
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
          @update:options="loadItems"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.nombres }}</td>
              <td>{{ item.apellidos }}</td>
              <td>{{ item.dni }}</td>
              <td>{{ item.comision }}</td>
              <td>
                <div class="state-order modal-order" :class="item.state === 3 ? 'inactivo' : 'activo'">
                  {{ item.state === 3 ? 'Inactivo' : 'Activo' }}
                </div>
              </td>
              <td>
                <div>
                  <v-icon class="mr-2">mdi-eye</v-icon>
                  <v-icon>mdi-pencil</v-icon>
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