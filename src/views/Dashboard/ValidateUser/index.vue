<script>
import EndValidate from "@/components/ValidateUserActive/endValidate.vue"
import ValidateDocument from "@/components/validateUserActive/validateDocument.vue"
import ValidatePhoto from "@/components/validateUserActive/validatePhoto.vue"
import ValidateBank from "@/components/validateUserActive/validateBank.vue"
import {userUserStore} from '@/stores/user'
import { mapState } from "pinia"

export default {
  components: {
    EndValidate,
    ValidateDocument,
    ValidatePhoto,
    ValidateBank
  },

  data() {
    return {
      validateValidateUser1: false,
      validateValidateUser2: false,
      validateValidateUser3: false,
      sectionActive: 1,
      sections: 3,
    }
  },

  computed: {
    ...mapState(userUserStore, ['getStateUser']),
    newlva () {
      return this.getStateUser
    }
  },

  async mounted() {
    const staeValidate = this.newlva
    this.sectionActive = parseInt(staeValidate)
  },

  methods: {
    clickPass1(value) {
      this.sectionActive = value
    }
  },
}
</script>

<template>
  <div>
    <div class="content-section-validate">
      <div :class="`content-section-active ${'active'+sectionActive}`">
        <div class="d-flex" v-for="(item, index) in sections" :key="index">
          <div :class="`item ${sectionActive == (index+1) ? 'active' : sectionActive === 4 ? 'active-global' : ''}`">{{ index + 1 }}</div>
          <div :class="`circle-pass ${'active'+(index+1)}`" v-if="sections - 1 !== index">
            <div></div><div></div><div></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <ValidateDocument 
        v-if="sectionActive === 1"
        @send-data="clickPass1(2)"
      />
      <ValidatePhoto 
        v-if="sectionActive === 2"
        @send-data="clickPass1(3)"
      />
      <ValidateBank 
        v-if="sectionActive === 3"
        @send-data="clickPass1(4)"
      />
      <EndValidate
        v-if="sectionActive === 4"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-section-active {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 46px;
  margin-bottom: 64px;
  .item{
    width: 40px;
    height: 40px;
    color: #005E81;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    font-family: 'Archivo-Bold';
    font-size: 18px;
    &.active{
      border-radius: 50%;
      background: #B9DFD9;
    }
    &.active-global{
      border-radius: 50%;
      background: #00ACAC;
    }
  }
  &.active0{
    .item{
      border-radius: 50%;
      background: #B9DFD9;
    }
    .circle-pass{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      div{
        width: 7px;
        height: 8px;
        transform: rotate(45deg);
        background: rgba(0, 172, 172, 0.25);
        margin: 0 5.5px;
        &:nth-child(2){
          background: rgba(0, 172, 172, 0.25)
        }
        &:nth-child(3){
          background: rgba(0, 172, 172, 0.25)
        }
      }
    }
  }
  &.active1{
    .circle-pass{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      &.active1{
        div{
          width: 7px;
          height: 8px;
          transform: rotate(45deg);
          background: #00ACAC;
          margin: 0 5.5px;
          &:nth-child(2){
            background: rgba(0, 172, 172, 0.5)
          }
          &:nth-child(3){
            background: rgba(0, 172, 172, 0.25)
          }
        }
      }
      div{
        width: 7px;
        height: 8px;
        transform: rotate(45deg);
        background: rgba(0, 172, 172, 0.25);
        margin: 0 5.5px;
        &:nth-child(2){
          background: rgba(0, 172, 172, 0.25)
        }
        &:nth-child(3){
          background: rgba(0, 172, 172, 0.25)
        }
      }
    }
  }

  &.active2{
    .circle-pass{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      &.active2{
        div{
          width: 7px;
          height: 8px;
          transform: rotate(45deg);
          background: rgba(0, 172, 172, 0.25);
          margin: 0 5.5px;
          &:nth-child(2){
            background: rgba(0, 172, 172, 0.25)
          }
          &:nth-child(3){
            background: rgba(0, 172, 172, 0.25)
          }
        }
      }
      div{
        width: 7px;
        height: 8px;
        transform: rotate(45deg);
        background: rgba(0, 172, 172, 0.25);
        margin: 0 5.5px;
        &:nth-child(2){
          background: rgba(0, 172, 172, 0.25)
        }
        &:nth-child(3){
          background: #00ACAC
        }
      }
    }
  }

  &.active3{
    .circle-pass{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      &.active1{
        div{
          width: 7px;
          height: 8px;
          transform: rotate(45deg);
          background: rgba(0, 172, 172, 0.25);
          margin: 0 5.5px;
          &:nth-child(2){
            background: rgba(0, 172, 172, 0.25)
          }
          &:nth-child(3){
            background: rgba(0, 172, 172, 0.25)
          }
        }
      }
      &.active3{
        div{
          width: 7px;
          height: 8px;
          transform: rotate(45deg);
          background: rgba(0, 172, 172, 0.25);
          margin: 0 5.5px;
          &:nth-child(2){
            background: rgba(0, 172, 172, 0.25)
          }
          &:nth-child(3){
            background: rgba(0, 172, 172, 0.25)
          }
        }
      }
      div{
        width: 7px;
        height: 8px;
        transform: rotate(45deg);
        background: rgba(0, 172, 172, 0.25);
        margin: 0 5.5px;
        &:nth-child(2){
          background: rgba(0, 172, 172, 0.5)
        }
        &:nth-child(3){
          background: #00ACAC
        }
      }
    }
  }

  &.active4{
    .circle-pass{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      div{
        width: 7px;
        height: 8px;
        transform: rotate(45deg);
        background: #00ACAC;
        margin: 0 5.5px;
      }
    }
  }
  
}
</style>