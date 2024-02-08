<template>
  <v-app>
    <component :is="layout">
      <v-main class="relative">
        <img class="cuadros-top" src="@/assets/svg/cuadros-top.svg" alt="cuadors">
        <img class="cuadros-btn" src="@/assets/svg/cuadros-btn.svg" alt="cuadors">
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </v-main>
    </component>
  </v-app>
</template>

<script>
const defaultLayout = 'LayoutDashboard'
export default {
  name: 'App',

  computed: {
    layout () {
      return (this.$route.meta.layout || defaultLayout)
    }
  },
}
</script>

<style lang="scss" scoped>
.v-main{
  position: relative;
  img.cuadros-top{
    position: absolute;
    top: 40px;
    left: 0;
    animation: EntrarLeft .9s ease;
    @media screen and (max-width: 600px) {
      width: 65%;
      top: -6px;
    }
  }
  img.cuadros-btn{
    position: absolute;
    bottom: 40px;
    right: 0;
    animation: EntrarRight .9s ease;
    @media screen and (max-width: 600px){
      width: 50%;
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
