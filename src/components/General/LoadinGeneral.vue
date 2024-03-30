<script setup>
import { computed, onMounted, ref } from 'vue'
import { userUserStore } from '@/stores/user'
const userStore = userUserStore()

const view = computed(() => userStore.loading)

</script>

<template>
  <div v-if="view" class="conten-loaderg">
    <div class="loaderg">
      <div class="loaderg__image">
        <div class="loaderg__coin">
          <img src="@/assets/svg/logo-icon.svg" alt="">
        </div>
        <div class="loaderg__hand">
          <img src="@/assets/svg/logo-name.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.conten-loaderg{
  position: fixed;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999999999;
}
.loaderg {
  width: 65px;
  margin: auto;

  &__image {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  &__coin {
    animation: flip .5s ease-in-out infinite alternate-reverse both;
  }
}

@keyframes flip {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(-180deg);
  }
}
</style>