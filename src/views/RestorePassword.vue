<script setup>
import { computed, onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import CryptoJS from 'crypto-js'
import { useDisplay } from 'vuetify'
const authStore = userAuthStore()
const userStore = userUserStore()
const formRestore = ref(null)
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()
const route = useRoute()
const errorEmail = ref(false)
const show1 = ref(false)
const show2 = ref(false)
const loading = ref(false)
const tokenRoute = ref('')
const responsive = computed(() => mobile.value)
const { mobile } = useDisplay()

const encyptPasswordAES = (password, secret) => {
	return CryptoJS.AES.encrypt(password, secret).toString()
}

const passwordRules = [
	v => !!v || 'Contraseña obligatorio',
	v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Ingrese un Password correcto (1 mayuscula, 1 miniscula, 1 numero y un min de 8 caracteres)',
]

const matchRule = [
	v => !!v || 'Contraseña obligatorio',
	v => v === password.value || 'Las contraseñas no coinciden',
]

onMounted ( () => { 
	authStore.loading	= false
	if(route.query.token)
		tokenRoute.value = route.query.token
	else
		router.push('/login')
})

const sendLogin	= async () => {
  const valid = await formRestore.value.validate()
	if (valid.valid) {
		loading.value = true
		let dataSend = {
			password: encyptPasswordAES(password.value, 'SECRET_PASSWORD'),
			token: tokenRoute.value.replace(/['"]+/g, '')
		}
		const result = await authStore.restorePassword(dataSend)
		if (result.success) {
			sendEmail(result.data.email)
			loading.value = false
			setTimeout(() => {
				router.push('/dashboard')
			}, 3000);
    }
	}
}

const sendEmail = async (email) => {
  localStorage.setItem('tokenEmail', JSON.stringify('App 7aa9ecb42803ef00443bf73621d03741-f818b535-0585-4a49-9145-f5093c621211'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeancavar89@gmail.com>')
  formData.append('subject', 'Proceso de Recuperacion de Contraseña')
  formData.append('to', `{"to":"${email}"}}`)
  formData.append('html', `
    <div>
    <div style="width:100%; text-align: center;">
			<h1 style="color:#146489">Recuperacion de Contraseña</h1>
      <div style="color: #00ACAC;">Su contraseña fue restablecida con exito, ingrese a su cuenta con sus nuevas credenciales</div>
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
					<img class="frame" src="@/assets/images/frame-restablecer.png" alt="login" width="661" height="590">
				</div>
			</v-col>
			<v-col class="login" :cols="!responsive ? `4` : `12`">
				<div>
					<div class="text-center">
            <a href="/login">
						  <img class="mb-15 logo" src="@/assets/images/Logo.png" alt="logo" width="279" height="112">
            </a>
					</div>
					<v-card
						class="card-login"
						max-width="374"
					>
						<v-card-text>
							<v-form ref="formRestore" class="mb-3">
								<h1 class="mb-10 h-100 text-center title-recovery">Restablecer <br><br> Contraseña</h1>
								<v-text-field 
									:append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									variant="outlined" 
									:type="show1 ? 'text' : 'password'"
									v-model="password" 
									:rules="passwordRules" 
									placeholder="Contraseña"
									single-line
									class="ip-form"
									@click:append-inner="show1 = !show1"
								></v-text-field>
								<v-text-field 
									:append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
									variant="outlined" 
									:type="show2 ? 'text' : 'password'"
									v-model="confirmPassword"  
									:rules="matchRule" 
									placeholder="Confirmar Contraseña"
									single-line
									class="ip-form"
									@click:append-inner="show2 = !show2"
								></v-text-field>
								<v-btn class="btn-send" color="#70BA44" :width="!responsive ? `330` : `100%`" :height="!responsive ? `70` : `51`" @click="sendLogin" >Enviar</v-btn>
							</v-form>
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
					width: calc(100% - 200px);
					height: auto;
				}
				&.circle{
					animation: EntrarLeft .9s ease;
					margin-left: 7rem;
					margin-top: 5rem;
					width: calc(100% - 40px);
					height: auto;
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
			padding: 50px 40px !important;
			border: none;
			box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
			max-width: 450px !important;
			height: auto;
			border-radius: 30px !important;
			display: flex;
			justify-content: center;
			align-items: center;

			@media screen and (max-width: 600px) {
				max-width: 318px !important;
				padding: 40px 38px !important;
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
		}
	}
</style>