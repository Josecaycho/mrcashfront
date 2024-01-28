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
        <v-col class="cont-letter">
          <div class="cth">
            <div class="cth-title">¡Hola!</div>
            <div v-if="user" class="cth-names">
              {{ user.nombres }}
            </div>
            <div v-if="user" class="cth-names">
              {{ user.apellidos }}
            </div>
            <div class="cth-subtitle">¿Qué haremos hoy?</div>
          </div>
        </v-col>
        <v-col>
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
    
    &-title, &-subtitle{
      font-size: 36px;
      color: $blue2;
    }
    &-names{
      font-size: 100px;
      color: $blue2;
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
  img{
    position: absolute;
    top: 0;
    left: 0;
    animation: EntrarRight .9s ease;
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