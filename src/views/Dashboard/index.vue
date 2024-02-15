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
        <v-col cols="12" lg="6" class="cont-letter">
          <div class="cth">
            <div class="cth-title">¡Hola!</div>
            <div v-if="user" class="cth-names">
              {{ user.nombres.split(" ")[0] }} {{ user.apellidos.split(" ")[0] }}
            </div>
            <div class="cth-subtitle">¿Qué haremos hoy?</div>
          </div>
        </v-col>
        <v-col cols="12" lg="6">
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
  align-items: flex-start;
  position: relative;

  .cth{
    font-family: 'Archivo-SemiBold';
    position: absolute;
    top: 0;
    left: 0;
    animation: EntrarLeft .9s ease;
    @media screen and (max-width: 600px) {
      position: relative;
    }
    
    &-title, &-subtitle{
      font-size: 36px;
      color: $blue2;
      @media screen and (max-width: 600px) {
        font-size: 26px;
      }
    }
    &-names{
      font-size: 100px;
      color: $blue2;
      @media screen and (max-width: 600px) {
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
  position: relative;
  @media screen and (max-width: 600px) {
    text-align: center;
  }
  img{
    position: absolute;
    top: 0;
    left: 0;
    animation: EntrarRight .9s ease;
    @media screen and (max-width: 600px) {
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