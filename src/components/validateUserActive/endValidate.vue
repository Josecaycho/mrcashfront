<template>
  <div class="d-flex justify-center aling-center h-100">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" lg="6" class="d-flex justify-center align-center">
          <div class="content-info-finish">
            <div class="title">
              ¡Ya esta por finalizar!
            </div>
            <p class="subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Est ultricies integer quis auctor elit.
            </p>
          </div>
        </v-col>
        <v-col cols="12" lg="6" class="text-center">
          <img class="frame" src="@/assets/images/frame-finish.png" alt="register">
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<style lang="scss">
.content-info-finish{
  @media screen and (max-width: 959px) {
    text-align: center;
  }
}
.title{
  font-size: 36px;
  color: #146489;
  margin-bottom: 15px;
}

.subtitle{
  color: #0085AE;
  font-size: 20px;
}

.frame{
  animation: EntrarLeft 1.5s ease;
  z-index: 1;
  width: calc(100% - 150px);
  height: auto;
}

</style>