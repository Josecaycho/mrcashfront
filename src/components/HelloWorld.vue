<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { userAuthStore } from '@/stores/auth'
const authStore = userAuthStore()
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="logo"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <div>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="wrapper">

          <nav v-if="!authStore.isLogged">
            <RouterLink to="/login">login</RouterLink>
            <RouterLink to="/registro">registro</RouterLink>
          </nav>
        </div>
      </div>
    </v-row>
  </v-container>
</template>
