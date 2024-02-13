<script setup>
import { userAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const authStore = userAuthStore()
const activeitem = ref(1)
const route = useRoute()
const navUser = [
  {
    img: 'new-orden',
    name: 'Nueva Orden',
    view: 'nueva-orden'
  },
  {
    img: 'orden',
    name: 'Ordenes',
    view: 'ordenes'
  },
  {
    img: 'banks',
    name: 'Bancos',
    view: 'cuentas'
  },
  {
    img: 'user',
    name: 'Perfil',
    view: 'perfil'
  }
]

const getImageUrl = (name) => {
  return new URL(`../assets/svg/nav/${name}`, import.meta.url).href
}
</script>

<template>
  <div class="nav-mr">
    <div class="item-nav" :class="route.name === item.view ? 'active': ''" v-for="(item, index) in navUser" :key="index">
      <router-link :to="`/dashboard/${item.view}`">
        <div>
          <img :src="getImageUrl(`${item.img}${route.name === item.view  ? '-active': ''}.svg`)" alt="">
          <p>{{ item.name }}</p>
        </div>
      </router-link >
    </div>
    <v-divider class="border-opacity-100 divider-responsive" :thickness="3" color="#fff"></v-divider>
    <v-btn class="btn-logout" color="#fff" variant="text" v-if="authStore.isLogged" @click="authStore.logout()">
      <span>Salir</span>
      <v-icon class="ml-2" color="#fff">mdi-logout</v-icon>
    </v-btn>
    <div class="item-nav img-logout" @click="authStore.logout()">
      <img src="../assets/svg/icons/logout.svg" alt="">
    </div>
  </div>
</template>


<style lang="scss" scoped>
.nav-mr{
  position: fixed;
  left: 43px;
  top: 101px;
  background: #00ACAC;
  max-width: 105px ;
  padding: 15px;
  border-radius: 26px;
  z-index: 99999;
  @media screen and (max-width: 600px) {
    bottom: 0;
    top: unset;
    width: 100%;
    max-width: 100%;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0;
    padding: 5px 15px;
  }
  .item-nav{
    color: #fff;
    text-align: center;
    max-width: 86px;
    height: 86px;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 600px) {
      margin-bottom: 0px;
      height: auto;
      padding: 10px;
    }
    a{
      color: white;
      text-decoration: none;
    }
    &.active{
      color: #00ACAC !important;
      background: #fff;
      border-radius: 14px;
      a{
        color: #00ACAC !important;
      }
    }
    &:nth-child(1){
      margin-top: 30px;
      @media screen and (max-width: 600px) {
        margin: 0;
      }
    }
    p{
      line-height: 15px;
      @media screen and (max-width: 600px) {
        display: none;
      }
    }
  }
  .btn-logout{
    font-family: 'Archivo-Bold';
    text-transform: capitalize;
    margin-top: 20px;
    display: block;
    @media screen and (max-width: 600px) {
      margin-top: 0 !important;
      display: none
    }
    span{
      @media screen and (max-width: 600px) {
        display: none;
      }
    }
    i{
      width: 42px;
    }
  }

  .img-logout{
    display: none;
    @media screen and (max-width: 600px) {
      display: block
    }
  }

  .divider-responsive{
    @media screen and (max-width: 600px) {
      display: none
    }
  }

  @media screen and (max-width: 600px) {
    // display: none;
  }
}
</style>