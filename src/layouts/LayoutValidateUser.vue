<script setup>
import NavItems from '@/layouts/NavItems.vue';
import { storeToRefs } from 'pinia';
import { userAuthStore } from '@/stores/auth'
const authStore = userAuthStore()
const { user } = storeToRefs(authStore);

import { userUserStore } from '@/stores/user'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const userStore = userUserStore()
const router = useRouter()

</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar
      :order="1"
      color="#146489"
      flat
      height="71"
      class="app-bar-fixed"
    >
      <template v-slot:prepend>
        <v-btn class="btn-logout" color="#fff" variant="text" v-if="authStore.isLogged" @click="authStore.logout()">
          Cerrar Sesión
          <v-icon class="ml-2" color="#fff">mdi-logout</v-icon>
        </v-btn>
      </template>
      <template v-slot:append>
        <div class="info-user" v-if="user">
          Bienvenido: {{ `${user.nombres}` }}
          <div>
            <v-icon size="22" class="icon-user">mdi-account</v-icon>
          </div>
        </div>
      </template>
    </v-app-bar>

    <v-main >
      <div>
        <img class="cuadros-top" src="@/assets/svg/cuadros-btn.svg" alt="cuadors">
        <img class="cuadros-btn" src="@/assets/svg/cuadros-top.svg" alt="cuadors">
        <img class="circle-top" src="@/assets/svg/circle-blue.svg" alt="cuadors">
        <img class="circle-btn" src="@/assets/svg/circle-green.svg" alt="cuadors">
      </div>
      <div class="cont-mcas-validate">
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
    </v-main>
  </v-layout>
</template>


<style lang="scss" scoped>
.app-bar-fixed{
  position: fixed !important;
  z-index: 999999999 !important;
}
.v-main{
  position: relative;
  img{
    &.cuadros-top{
      position: absolute;
      top: 55px;
      right: 0;
      animation: EntrarLeft .9s ease;
      @media screen and (max-width: 600px){
        top: 15px;
      }
    }
    &.cuadros-btn{
      position: absolute;
      bottom: 40px;
      left: 0;
      animation: EntrarRight .9s ease;
    }
    &.circle-top{
      position: absolute;
      top: 0;
      left: 0;
      animation: EntrarRight .9s ease;
      z-index: -1;
    }
    &.circle-btn{
      position: absolute;
      bottom: 0;
      right: 0;
      animation: EntrarLeft .9s ease;
    }
  }
  @keyframes EntrarLeft {
    from{
      transform: translateX(200%);
    }
    to{
      transform: translateX(0);
    }
  }

  @keyframes EntrarRight {
    from{
      transform: translateX(-200%);
    }
    to{
      transform: translateX(0);
    }
  }
}

.info-user {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-right: 40px !important;
  @media screen and (max-width: 600px){
    margin-right: 0 !important;
    margin-left: 20px;
    margin-left: 20px;
  }
  .icon-user{
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 13px;
  }
}

.cont-mcas{
  z-index: 999999;
  position: relative;
  padding-top: 20px;
}
</style>