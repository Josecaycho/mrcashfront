<script setup>
import { computed, onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
const authStore = userAuthStore()
const userStore = userUserStore()
const formRecovery = ref(null)
const form = ref({email: ''})
const router = useRouter()
const errorEmail = ref(false)
const loading = ref(false)
const successSend = ref(false)
const responsive = computed(() => mobile.value)
const { mobile } = useDisplay()

const emailRules = [
  v => !!v || 'Email obligatorio',
  v => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(v) || 'Ingrese Email valido',
]

onMounted ( () => { 
	authStore.loading	= false
})

const sendLogin	= async () => {
  const valid = await formRecovery.value.validate()
	if (valid.valid) {
		loading.value = true
		const result = await authStore.recoveryPassword(form.value)
		if (result.success) {
			sendEmail(result.data.token)
			loading.value = false
			successSend.value = true
			setTimeout(() => {
				router.push('/login')
			}, 4000);
    } else {
			errorEmail.value = true
			loading.value = false
			setTimeout(() => {
				errorEmail.value = false
			}, 2000);
		}
	}
}

const sendEmail = async (token) => {
  localStorage.setItem('tokenEmail', JSON.stringify('App 7aa9ecb42803ef00443bf73621d03741-f818b535-0585-4a49-9145-f5093c621211'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeancavar89@gmail.com>')
  formData.append('subject', 'Proceso de Recuperacion de Contraseña')
  formData.append('to', `{"to":"${form.value.email}"}}`)
  formData.append('html', `
    <div>
    <div style="width:100%; text-align: center;">
			<h1 style="color:#146489">Recuperacion de Contraseña</h1>
      <div style="color: #00ACAC;">Ingrese a esta ruta local http://localhost:5173/restaurar?token='${token}''</div>
    </div>
  `);
  userStore.sendEmail(formData)
}

</script>
<template>
	<div class="content-login">
		<v-row class="contents-row" no-gutters>
			<v-col cols="12" lg="7" v-if="!responsive">
				<div class="banner">
					<img class="frame" src="@/assets/images/frame-login.png" alt="login" width="661" height="590">
					<img class="circle" src="@/assets/svg/circles.svg" alt="circle">
				</div>
			</v-col>
			<v-col class="login" :cols="!responsive ? `4` : `12`">
				<div>
					<div class="text-center">
						<a href="/login">
						  <img class="mb-15" src="@/assets/images/Logo.png" alt="logo" width="279" height="112">
            </a>
					</div>
					<v-card
						class="card-login"
						max-width="374"
					>
						<v-card-text v-if="!successSend">
							<v-form ref="formRecovery" class="mb-3" @submit.prevent>
								<h1 class="mb-10 h-100 text-center title-recovery">Recuperar <br><br> Contraseña</h1>
								<v-text-field 
									variant="outlined" 
									v-model="form.email" 
									:rules="emailRules" 
									single-line
									placeholder="Email" 
									style="max-width: 330px;max-height: 52px;"
									class="mb-6"
									:error-messages="errorEmail ? `Email no encontrado` : ``"
								></v-text-field>
								<v-btn class="btn-send" :loading="loading" color="#70BA44" width="330" height="70" @click="sendLogin" >Enviar</v-btn>
							</v-form>
						</v-card-text>
						<v-card-text v-else>
							<div class="text-center">
								<img src="@/assets/svg/bienvenido-register.svg" alt="" class="mb-9">
								<h1 class="h-100 text-center title-section title-section-success"><b>Solicitud Enviada !</b></h1>
								<p class="txt-success">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
							</div>
						</v-card-text>
					</v-card>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<style lang="scss">
	.content-login{
		height: 100vh;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    display: flex;

		.contents-row{
			height: inherit;
			.v-col.login{
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 103px;
				@media screen and (max-width: 959px) {
					padding-top: 20px;
				}
			}
		}

		.banner{
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			img{
				position: absolute;
				&.frame{
					animation: EntrarLeft 1.5s ease;
					margin-top: 9rem;
					z-index: 1;
				}
				&.circle{
					animation: EntrarLeft .9s ease;
					margin-left: 7rem;
					margin-top: 5rem;
				}
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

		.card-login{
			padding: 70px 60px !important;
			border: none;
			box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
			max-width: 450px !important;
			height: 580px;
			border-radius: 30px !important;
			display: flex;
			justify-content: center;
			align-items: center;

			@media screen and (max-width: 600px) {
				max-width: 318px !important;
				padding: 65px 38px !important;
				height: max-content;
				display: block;
			}

			.v-card-text{
				margin: 0;
				padding: 0;
			}

      .title-recovery{
        color: $blue2
      }

			.v-text-field .v-field {	
				border: 1.5px solid $green;
				border-radius: 18px;
				color: $blue;
				font-family: 'Archivo-SemiBold';
				padding-left: 20px;
				height: 54px;
				width: 330px;
				box-shadow: rgba(50, 50, 93, 0.2) 0px 3px 5px 0px, rgba(0, 0, 0, 0.1) -1px 0px 3px -1px;
				background: white;
			}
			.btn-send{
				font-size: 22px !important;
				text-transform: capitalize !important;
				border-radius: 18px !important;
				margin-top: 64px;
				@media screen and (max-width: 959px) {
					margin-top: 30px;
				}
			}
			.register {
				font-size: 17px;
				p{
					color: $blue;
				}
				a{
					color: $green2;
					font-weight: 700;
					text-decoration: unset;
				}
			}
			.forgot-password {
				margin-top: 56px;
				text-align: center;
				width: 100%;
				a{
					color: $blue2;
					font-size: 20px;
					text-decoration: unset;
					font-weight: 700;
				}
			}

			.title-section-success{
					line-height: 44px;
					font-family: 'Archivo-SemiBold';
					margin-bottom: 79px;

					@media screen and (max-width: 600px) {
						margin-bottom: 30px;
						line-height: 28px;
					}
					b{
						font-weight: 900;
						font-family: 'Archivo-Bold';
					}
				}
		}
		.n-view{
			display: none;
		}
	}
</style>