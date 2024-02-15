<script setup>
import { computed, onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
const authStore = userAuthStore()
const userStore = userUserStore()
const formLogin = ref(null)
const form = ref({dni: '', password: ''})
const loading = ref(false)
const router = useRouter()
const errorDni = ref(false)
const errorPassword= ref(false)

const { mobile } = useDisplay()
const titlebutton = ref('Ingresar')

const dniRules = [
  v => !!v || 'DNI obligatorio',
  v => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido'
]

const passwordRules = [
	v => !!v || 'Contraseña obligatorio',
	// v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
]

onMounted ( () => { 
	authStore.loading	= false
})

const responsive = computed(() => mobile.value)

const sendLogin	= async () => {
	loading.value = true
	const valid = await formLogin.value.validate()
	if (valid.valid) {
		const result = await authStore.login(form.value)
		if (result.success) {
			setTimeout(async () => {
				loading.value = false
				titlebutton.value = "Bienvenido"
				const valid = await userStore.stateUser()
				console.log(valid)
				if(valid[0].state !== 0) {
					await router.push('/validateUser')
				}else {
					await router.push('/dashboard')
				}
			}, 4000);
		} else {
			if(result.message === 'Usuario No existe') {
				errorDni.value = true
				setTimeout(() => {
					errorDni.value = false
				}, 2000);
			}else if (result.message === 'Contraseña incorrecta') {
				errorPassword.value = true
				setTimeout(() => {
					errorPassword.value = false
				}, 2000);
			}
			loading.value = false
		}
	}
}

</script>
<template>
	<div class="content-login">
		<v-row class="contents-row" no-gutters>
			<v-col cols="7" v-if="!responsive">
				<div class="banner">
					<img class="frame" src="@/assets/images/frame-login.png" alt="login" width="661" height="590">
					<img class="circle" src="@/assets/svg/circles.svg" alt="circle">
				</div>
			</v-col>
			<v-col class="login" :cols="!responsive ? `4` : `12`">
				<div>
					<div class="text-center">
						<a href="/login">
						  <img :class="!responsive ? `mb-15` : `mb-8`" src="@/assets/images/Logo.png" alt="logo" :width="!responsive ? `279` : '232'" :height="!responsive ? `112` : '94'">
            </a>
					</div>
					<v-card
						class="card-login"
						max-width="374"
					>
						<v-card-text>
							<v-form ref="formLogin" class="mb-3">
								<h1 class="mb-10 h-100 text-center title-section">Inicia sesión</h1>
								<v-text-field 
									variant="outlined" 
									v-model="form.dni" 
									:rules="dniRules" 
									single-line
									placeholder="DNI" 
									class="mb-6"
									:error-messages="errorDni ? `Usuario No existe` : ``"
								></v-text-field>
								<v-text-field 
									variant="outlined" 
									type="password" 
									v-model="form.password" 
									:rules="passwordRules" 
									placeholder="Contraseña" 
									single-line
									:error-messages="errorPassword ? `Contraseña incorrecta` : ``"
								></v-text-field>
								<v-btn class="btn-send" color="#70BA44" :loading="loading" :width="!responsive ? `330` : `100%`" :height="!responsive ? `70` : `51`" @click="sendLogin" >{{titlebutton}}</v-btn>
							</v-form>
							<!-- <v-btn href="/registro">Registrate</v-btn> -->
							<div class="register mt-8 text-center">
								<p>¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a> </p>
							</div>
							<div class="forgot-password">
								<a href="/recuperar">¿Olvidaste tu contraseña?</a>
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

			.title-section{
				font-size: 36px;
				color: #005E81;

				@media screen and (max-width: 600px) {
					font-size: 26.3px;
				}
			}
			

			.v-card-text{
				margin: 0;
				padding: 0;

				.v-input{
					max-width: 330px;
					max-height: 54px;
					@media screen and (max-width: 600px) {
						max-width: 241px;
						min-height: 39.5px;
					}
					.v-input__details{
						align-items: flex-start;
						padding-top: 4px;
					}
				}
			}

			.v-text-field .v-field {	
				border: 1.5px solid $green;
				border-radius: 18px;
				color: $blue;
				font-family: 'Archivo-SemiBold';
				padding-left: 5px;
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
				@media screen and (max-width: 600px) {
					font-size: 12.4px;
				}
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
				font-size: 20px;
				@media screen and (max-width: 600px) {
					font-size: 14.6px;
				}
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