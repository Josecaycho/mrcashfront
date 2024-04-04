<script setup>
import { computed, onMounted, ref } from "vue";
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import Chart, { Colors } from 'chart.js/auto'

const adminStore = adminAdminStore()
const authStore = userAuthStore()
const resumen = ref([])

const year = ref(null)
const years = ref([
  {id: 2024, name: "2024"},
  {id: 2025, name: "2025"},
  {id: 2026, name: "2026"},
  {id: 2027, name: "2027"}
])

const monthI = ref(null)
const monthF = ref(null)

const months = [
  {id: '01', name: "Enero"},
  {id: '02', name: "Febrero"},
  {id: '03', name: "Marzo"},
  {id: '04', name: "Abril"},
  {id: '05', name: "Mayo"},
  {id: '06', name: "Junio"},
  {id: '07', name: "Julio"},
  {id: '08', name: "Agosto"},
  {id: '09', name: "Septiembre"},
  {id: '20', name: "Octubre"},
  {id: '11', name: "Noviembre"},
  {id: '12', name: "Diciembre"},
]

const bank = ref(null)
const banks = ref([])

const loading = ref(true)
const loadingGeneral = ref(true)

const labels = ['January','February','March','April','May','June','July','August','September','October','November','December']

onMounted(async () => {
  const date = new Date()
  year.value = date.getFullYear()
  monthI.value = date.getMonth() < 9 ? `0${date.getMonth()}` : date.getMonth()
  monthF.value = date.getMonth() < 9 ? `0${date.getMonth()}` : date.getMonth()
  banks.value = [{id: 0, name_bank: "Todos"}, ...JSON.parse(JSON.stringify( authStore.banks))]
  bank.value = 1
  await getdataResumen()
})

const getdataResumen = async () => {
  const result = await adminStore.getDataResumen({
    year: year.value,
    bank: bank.value,
    monthInicial: monthI.value,
    monthFinal: monthF.value
  })
  if(result.success) {
    resumen.value = await result.data
    loadingGeneral.value = false
    let montos = JSON.parse(result.data[0].contentInfo.meses)
    document.getElementById("myChart").remove()
    let canvas = document.createElement("canvas");
    canvas.id = "myChart"; 
    document.getElementById("contenedor").appendChild(canvas);
    if(result.data.length === 1) {
      let datasets = [
                      {
                        label: result.data[0].name_bank,
                        backgroundColor: result.data[0].color,
                        borderColor: result.data[0].color,
                        data: montos,
                      },
                    ]
      const myChart = new Chart(
        document.getElementById('myChart'),
        {
          type: 'bar',
          data: {
            labels: labels,
            datasets
          },
          options: {}
        }
      );
    }else {
      let datasets = []
      for (let i = 0; i < result.data.length; i++) {
        if(result.data[i].contentInfo.monto_total !== null)
          datasets.push({
            label: result.data[i].name_bank,
            backgroundColor: result.data[i].color,
            borderColor: result.data[i].color,
            data: JSON.parse(result.data[i].contentInfo.meses),
          })
      }
      const myChart = new Chart(
        document.getElementById('myChart'),
        {
          type: 'bar',
          data: {
            labels: labels,
            datasets
          },
          options: {}
        }
      );
    }
  }
}

const searchState = (state) => {
  year.value = state.id
  loadingGeneral.value = true
  getdataResumen()
}

const searchBank = (state) => {
  bank.value = state.id
  loadingGeneral.value = true
  getdataResumen()
}

const searchMonth = (state, type) => {
  if(type === 1) {
    monthI.value = state.id
  }else monthF.value = state.id
  getdataResumen()
}


</script>

<template>
  <div class="cont-mcas cont-mcas-inter">
    <v-container>
      <div class="title-views text-center">
        Listas de Devoluciones
      </div>
      <v-row>
        <v-col class="ms-md-auto" cols="12" lg="3">
          <v-select
            v-model="monthI"
            :items="months"
            label="Mes inicial"
            class="ip-form style-calendar"
            item-title="name"
            item-value="id"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #title>
                  <div @click="searchMonth(item.raw,1)" class="d-flex justify-star align-center">{{ `${item.raw.name}`}}</div>
                </template>
              </v-list-item>
            </template>
          </v-select> 
        </v-col>
        <v-col class="ms-md-auto" cols="12" lg="3">
          <v-select
            v-model="monthF"
            :items="months"
            label="Mes final"
            class="ip-form style-calendar"
            item-title="name"
            item-value="id"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #title>
                  <div @click="searchMonth(item.raw,2)" class="d-flex justify-star align-center">{{ `${item.raw.name}`}}</div>
                </template>
              </v-list-item>
            </template>
          </v-select> 
        </v-col>
        <v-col class="ms-md-auto" cols="12" lg="3">
          <v-select
            v-model="year"
            :items="years"
            label="Años"
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
        <v-col class="ms-md-auto" cols="12" lg="3">
          <v-select
            v-model="bank"
            :items="banks"
            label="Bancos"
            class="ip-form style-calendar"
            item-title="name_bank"
            item-value="id"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #title>
                  <div @click="searchBank(item.raw)" class="d-flex justify-star align-center">{{ `${item.raw.name_bank}`}}</div>
                </template>
              </v-list-item>
            </template>
          </v-select> 
        </v-col>
      </v-row>
      <div v-if="loadingGeneral" >
        <div v-for="(item, index) in 3" :key="index">
          <v-skeleton-loader
            :loading="loadingGeneral"
            type="text"
            width="460"
            style="background: transparent;"
          >
          </v-skeleton-loader>
          <v-row >
            <v-col cols="12" lg="4" md="4" v-for="(om, i) in 3" :key="i">
              <v-skeleton-loader
                :loading="loadingGeneral"
                type="image"
              >
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else class="content-order d-flex align-center justify-center mt-5" >
        <v-row>
          <v-col cols="12" lg="12" md="12" v-for="(item, index) in resumen" :key="index">
            <h4 class="mb-5">{{ item.name_bank }}</h4>
            <v-row>
              <v-col>
                <div cols="12" lg="4" md="4">
                  <div class="w-100 d-flex justify-center align-center ct-info">
                    <div class="text-center">
                      <div class="title">Monto Ingresado</div>
                      <div>
                        S/. <span class="num">{{ item.contentInfo.monto_total === null ? 0 : item.contentInfo.monto_total }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col>
                <div cols="12" lg="4" md="4">
                  <div class="w-100 d-flex justify-center align-center ct-info">
                    <div class="text-center">
                      <div class="title">Monto Enviado</div>
                      <div>
                        S/. <span class="num">{{ item.contentInfo.monto_enviado === null ? 0 : item.contentInfo.monto_enviado }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col>
                <div cols="12" lg="4" md="4">
                  <div class="w-100 d-flex justify-center align-center ct-info">
                    <div class="text-center">
                      <div class="title">Balance</div>
                      <div>
                        S/. <span class="num">{{ item.contentInfo.balance === null ? 0 : item.contentInfo.balance }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div class="mt-10" id="contenedor">
        <canvas id="myChart"></canvas>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss">
.ct-info{
  height: 100px;
  border: 1px solid #ccc;
  .title{
    font-size: 18px;
    color: #a7a7a7;
  }
  .num{
    font-size: 30px;
  }
}
</style>