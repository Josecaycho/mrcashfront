<script setup>
import { storeToRefs } from 'pinia';
import { userAuthStore } from '@/stores/auth'
const authStore = userAuthStore()
const { user } = storeToRefs(authStore);

</script>
<template>
  <div class="cont-mcas-das">
    <v-container>
      <v-row>
        <v-col cols="12" lg="6" md="12" class="cont-letter">
          <div class="cth">
            <div class="cth-title">¡Hola!</div>
            <div v-if="user" class="cth-names">
              <p>{{ user.nombres.split(" ")[0] }}</p> 
              <p>{{ user.apellidos.split(" ")[0] }}</p>
            </div>
            <div class="cth-subtitle">¿Qué haremos hoy?</div>
          </div>
        </v-col>
        <v-col cols="12" lg="6" md="12">
          <div class="cont-frame">
            <img src="@/assets/images/frame-dash.png" alt="">
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<style lang="scss" scoped>
.cont-letter{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .cth{
    font-family: 'Archivo-SemiBold';
    animation: EntrarLeft .9s ease;
    @media screen and (max-width: 1024px) {
      position: relative;
    }
    
    &-title, &-subtitle{
      font-size: 36px;
      color: $blue2;
      @media screen and (max-width: 1024px) {
        font-size: 26px;
      }
    }
    &-names{
      font-size: 100px;
      color: $blue2;
      @media screen and (max-width: 1024px) {
        font-size: 64px;
      }
    }
    &-subtitle{
      color: $blue3;
    }
  }

  @keyframes EntrarLeft {
    from{
      transform: translateX(-200%);
    }
    to{
      transform: translateX(0);
    }
  }
}
.cont-frame{
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1024px) {
    text-align: center;
  }
  img{
    animation: EntrarRight .9s ease;
    @media screen and (max-width: 1024px) {
      position: relative;
      width: 300px;
    }
  }
  @keyframes EntrarRight {
    from{
      transform: translateX(200%);
    }
    to{
      transform: translateX(0);
    }
  }
}
</style>