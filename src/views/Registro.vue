<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useDisplay } from 'vuetify'
import CryptoJS from 'crypto-js'

import { emailRegistro } from '@/plugins/email/senEmails'

const authStore = userAuthStore()
const userStore = userUserStore()
const form1 = ref({dni: '', nombres: '', apellidos: ''})
const form2 = ref({email: '', phone: ''})
const password = ref('')
const confirmPassword = ref('')
const politicPerson = ref(null)
const tc = ref(null)
const politicData = ref(null)
const formRegister = ref(null)
const router = useRouter()
const show1 = ref(false)
const show2 = ref(false)
const loading = ref(false)

const errorDni = ref(false)

const formRegister1 = ref(null)
const formRegister2 = ref(null)
const validateRegister1 = ref(false)
const validateRegister2 = ref(false)
const successRegister = ref(false)


const { mobile } = useDisplay()

const encyptPasswordAES = (password, secret) => {
	return CryptoJS.AES.encrypt(password, secret).toString()
}

const sendRegister	= async () => {
	try {
		const result = await authStore.validateDni(form1)
		if (result.success) {
			const valid1 = await formRegister1.value.validate()
			validateRegister1.value = valid1.valid
		}else{
			errorDni.value = true
			setTimeout(() => {
				errorDni.value = false
			}, 2000);
		}
	} catch (error) {
			
	}
}

const responsive = computed(() => mobile.value)

const sendRegisterFinal = async () => {
	loading.value = true
	const valid2 = await formRegister2.value.validate()
	// validateRegister2.value = valid2.valid
	const data = {...form1.value, ...form2.value, password: password.value, politic_person: (politicPerson.value === 'true'), t_c: tc.value, politic_data: politicData.value }
	if (valid2.valid) {
		try {
			const result = await authStore.registro(data)
			if (result.success) {
				sendEmail()
				setTimeout(() => {
					router.push('/login')
					loading.value = true
				}, 5000);
				successRegister.value = true
			}else {
				alert(result.message)
			}
		} catch (error) {
			
		}
	} else {
		if(politicPerson.value === null || !politicPerson.value) {
			politicPerson.value = false	
		} else politicPerson.value = politicPerson.value
		if(tc.value === null || !tc.value) {
			tc.value = false	
		} else tc.value = tc.value
		if(politicData.value === null || !politicData.value) {
			politicData.value = false	
		} else politicData.value = politicData.value
		loading.value = false
	}
}

const sendEmail = async () => {
  localStorage.setItem('tokenEmail', JSON.stringify('App e0112c26f5836ba7fdcb26b22eb5e2a6-68b0bd1f-7933-4692-a9d9-9d9e5169a87c'));
  const formData = new FormData()
  formData.append('from', 'Administracion <jeanvargas0324@proton.me>')
  formData.append('subject', 'Proceso de Registro de nuevo Usuario')
  formData.append('to', `{"to":"${form2.value.email}","placeholders":{"firstName":"${form1.value.apellidos}"}}`)
  formData.append('html', emailRegistro(form1.value));
  userStore.sendEmail(formData)
}

const retroceder = async () => {
	validateRegister1.value = false
}

const nameRules = [
  v => !!v || 'Nombres obligatorio'
]

const lastNameRules = [
  v => !!v || 'Apellidos obligatorio'
]

const dniRules = [
  v => !!v || 'DNI obligatorio',
  v => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido',
]

const passwordRules = [
	v => !!v || 'Contraseña obligatorio',
	v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Ingrese un Password correcto (1 mayuscula, 1 miniscula, 1 numero y un min de 8 caracteres)',
]

const phoneRules = [
  v => !!v || 'Celular obligatorio',
  v => /^[0-9]{9,9}$/.test(v) || 'Ingrese un celular valido',
]

const emailRules = [
	v => !!v || 'Email obligatorio',
	v => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(v) || 'Ingrese Email valido',
]

const matchRule = [
	v => !!v || 'Contraseña obligatorio',
	v => v === password.value || 'Las contraseñas no coinciden',
]

const politicDataRules = [
	v => !!v || 'Campos obligatorios'
]

const errorTcrules = ref(false)

const TCRules = [
	v => !!v || 'Campos obligatorios'
]

const PDRules = [
	v =>!!v || 'Campos obligatorios'
]
</script>
<template>
	<div class="content-login" :class="!validateRegister1 && !validateRegister2 ? 'ps-1': 'ps-2'">
		<v-row class="contents-row" no-gutters>
			<v-col cols="7" v-if="!responsive">
				<div class="banner">
					<img v-if="!successRegister" class="frame" src="@/assets/images/frame-register.png" alt="register" width="661" height="590">
					<img v-else class="frame" src="@/assets/images/frame-register-success.png" alt="register" width="661" height="590">
				</div>
			</v-col>
			<v-col class="login" :cols="!responsive ? `4` : `12`">
				<div class="mt-5">
					<div class="text-center">
						<a href="/login">
						  <img :class="!responsive ? `mb-2 logo` : `mb-5 logo`" src="@/assets/images/Logo.png" alt="logo">
            </a>
					</div>
					<v-card
						class="card-login"
						max-width="374"
					>
						<v-card-text v-if="!successRegister">
							<h1 class="h-100 text-center title-section">Regístrate</h1>
							<div>
								<!-- <h3 class="text-center title-pass">{{ !validateRegister1 && !validateRegister2 ? 'Paso 1' : 'Paso 2' }}</h3> -->
								<div :class="`content-section-register ${!validateRegister1 && !validateRegister2 ? 'active1' : 'active2'}`">
									<div :class="`item ${!validateRegister1 && !validateRegister2 ? 'active' : ''}`">1</div>
									<div class="circle-pass">
										<div></div>
										<div></div>
										<div></div>
									</div>
									<div :class="`item ${validateRegister1 && !validateRegister2 ? 'active' : ''}`">2</div>
								</div>
							</div>
							<v-form v-if="!validateRegister1 && !validateRegister2" ref="formRegister1" class="mb-3">
								<v-text-field
									variant="outlined" 
									v-model="form1.nombres" 
									:rules="nameRules" 
									placeholder="Nombres"
									class="ip-form"
									single-line
								></v-text-field>
								<v-text-field
									variant="outlined" 
									v-model="form1.apellidos" 
									:rules="lastNameRules" 
									single-line
									class="ip-form"
									placeholder="Apellidos"
								></v-text-field>
								<v-text-field
									variant="outlined" 
									v-model="form1.dni" 
									:rules="dniRules" 
									placeholder="DNI"
									single-line
									class="ip-form"
									:error-messages="errorDni ? `DNI existente` : ``"
								></v-text-field>
								<v-btn class="btn-send" color="#70BA44" :width="!responsive ? `330` : `100%`" :height="!responsive ? `70` : `51`" @click="sendRegister">Siguiente</v-btn>
							</v-form>
							<v-form v-if="validateRegister1 && !validateRegister2" ref="formRegister2">
								<v-text-field
									variant="outlined" 
									v-model="form2.email" 
									:rules="emailRules" 
									placeholder="Email"
									class="ip-form"
									single-line
								></v-text-field>
								<v-text-field
									variant="outlined" 
									v-model="form2.phone" 
									:rules="phoneRules" 
									placeholder="Celular"
									class="ip-form"
									single-line
								></v-text-field>
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
								<p style="color:#0081A2">Persona politicamente expuesta</p>
								<v-radio-group
									v-model="politicPerson"
									inline
									:rules="politicDataRules"
									hide-details=""
								>
									<v-radio
										color="#00ABAC"
										value="false"
										:class="`${politicPerson !== null && !politicPerson ? 'rd-pex error' : 'rd-pex'}`"
									>
										<template v-slot:label>
											<div style="color:#0081A2">No</div>
										</template>
									</v-radio>
									<v-radio
										color="#00ABAC"
										value="true"
										:class="`${politicPerson !== null && !politicPerson ? 'rd-pex error' : 'rd-pex'}`"
									>
										<template v-slot:label>
											<div style="color:#0081A2">Si</div>
										</template>
									</v-radio>
									
								</v-radio-group>
								<v-checkbox
									v-model="tc"
									color="#61C028"
									:rules="TCRules"
									:class="`${tc !== null && !tc ? 'rd-pex error' : 'rd-pex'}`"
									hide-details
								>
									<template v-slot:label>
										<div>
											Aceptar <a class="dl-underline" href="" :style="`${tc !== null && !tc ? 'color:red' : 'color:#61C028'}`" >Términos y condiciones</a>
										</div>
									</template>
								</v-checkbox>
								<v-checkbox
									v-model="politicData"
									color="#61C028"
									:rules="PDRules"
									:class="`${politicData !== null && !politicData ? 'rd-pex error' : 'rd-pex'}`"
									hide-details
								>
									<template v-slot:label>
										<div>
											Aceptar <a class="dl-underline" href="" :style="`${politicData !== null && !politicData ? 'color:red' : 'color:#61C028'}`">Política de datos</a>
										</div>
									</template>
								</v-checkbox>
								<div class="mt-10">
									<v-btn variant="text" class="w-100 btn-after" @click="retroceder">
										<v-icon>mdi-chevron-left</v-icon>
										Atras
									</v-btn>
									<v-btn class="btn-send" color="#70BA44" :width="!responsive ? `330` : `100%`" :height="!responsive ? `70` : `51`" :loading="loading" @click="sendRegisterFinal">Registrar</v-btn>
								</div>
							</v-form>
							<div class="register mt-8 text-center">
								<p>¿No tienes una cuenta? <a href="/login">Inicia sesión</a> </p>
							</div>
						</v-card-text>
						<v-card-text v-else>
							<div class="text-center">
								<img src="@/assets/svg/bienvenido-register.svg" alt="" class="mb-9">
								<h1 class="h-100 text-center title-section title-section-success"><b>¡Bienvenido,</b> ya eres parte de Mr. Cash!</h1>
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
    justify-content: center;
    align-items: center;
    display: flex;

		@media screen and (max-width: 959px) {
			&.ps-1{
				overflow: hidden;
			}
			&.ps-2{
				overflow: auto;
			}
		}

		.contents-row{
			height: inherit;
			.v-col.login{
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.icon-float{
				position: absolute;
				right: 10px;
				top: 10px;
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
					margin-top: 4rem;
					z-index: 1;
					width: calc(100% - 200px);
					height: auto;
				}
				&.circle{
					animation: EntrarLeft .9s ease;
					margin-left: 7rem;
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
			padding: 40px !important;
			border: none;
			box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
			max-width: 450px !important;
			border-radius: 30px !important;
			position: relative;
			margin: 20px 0px;

			@media screen and (max-width: 600px) {
				max-width: 318px !important;
				padding: 40px 38px !important;
				height: max-content;
				margin-top: 20px !important;
				margin-bottom: 20px !important;
			}

			.title-section {
				color: #005E81;
				font-size: 36px;
				margin-bottom: 47px;
				@media screen and (max-width: 600px) {
					font-size: 26.3px;
					margin-bottom: 34px;
				}
				&-success{
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

			.txt-success{
				color: $blue;
				font-size: 20px;
				text-align: center;
			}
			
			.v-card-text{
				margin: 0;
				padding: 0;
				.v-input.ip-form{
					width: 330px;
					@media screen and (max-width: 600px) {
						max-width: 241px;
						min-height: 39.5px;
					}
					.v-input__details{
						align-items: flex-start;
						padding-top: 4px;
					}
					.v-field__field .v-label{
						@media screen and (max-width: 600px) {
							font-size: 14px;
						}
					}
				}
				.v-checkbox .v-selection-control{
					min-height: 40px;
				}
			}

			.title-pass{
				font-size: 28px;
				color: #00ACAC;
				font-family: 'Archivo-SemiBold';
				@media screen and (max-width: 600px) {
					font-size: 20px;
				}
			}

			.content-section-register {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 10px;
				margin-top: 45px;
				margin-bottom: 40px;
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
					@media screen and (max-width: 600px) {
						width: 26px;
						height: 26px;
						font-size: 10.45px;
					}
					&.active{
						border-radius: 50%;
						background: #B9DFD9;
					}
				}
				&.active1{
					.circle-pass{
						display: flex;
						justify-content: center;
						align-items: center;
						gap: 11px;
						@media screen and (max-width: 600px) {
							gap: 5px;
						}
						div{
							width: 7px;
							height: 8px;
							transform: rotate(45deg);
							background: #00ACAC;
							margin: 0 5.5px;
							@media screen and (max-width: 600px) {
								width: 5.2px;
								height: 5.2px;
							}
							&:nth-child(2){
								background: rgba(0, 172, 172, 0.5)
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
						@media screen and (max-width: 600px) {
							gap: 5px;
						}
						div{
							width: 7px;
							height: 8px;
							transform: rotate(45deg);
							background:  rgba(0, 172, 172, 0.25);
							margin: 0 5.5px;
							@media screen and (max-width: 600px) {
								width: 5.2px;
								height: 5.2px;
							}
							&:nth-child(2){
								background: rgba(0, 172, 172, 0.5)
							}
							&:nth-child(3){
								background: #00ACAC
							}
						}
					}
				}
				
			}

			.v-text-field .v-field {	
				border: 1.5px solid $green;
				border-radius: 18px;
				color: $blue;
				font-family: 'Archivo-SemiBold';
				padding-left: 5px;
				height: 54px;
				box-shadow: rgba(50, 50, 93, 0.2) 0px 3px 5px 0px, rgba(0, 0, 0, 0.1) -1px 0px 3px -1px;
				background: white;
			}
			.btn-after{
				text-transform: capitalize;
				color: #79B942;
				font-size: 18px;
				&:hover > .v-btn__overlay {
					background: transparent !important;
				}
			}
			.btn-send{
				font-size: 22px !important;
				text-transform: capitalize !important;
				border-radius: 18px !important;
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
				a{
					color: $blue2;
					font-size: 20px;
					text-decoration: unset;
					font-weight: 700;
				}
			}
			.rd-pex .v-label{
				font-size: 17px;
				@media screen and (max-width: 600px) {
					font-size: 12.4px;
				}
			}
			.rd-pex.v-selection-control--dirty .v-selection-control__input .v-icon::before {
				content: "\F0132" !important;
				color: #00ACAC;
			}
			.rd-pex .v-selection-control--dirty .v-selection-control__input .v-icon::before {
				content: "\F0132" !important;
				color: #00ACAC;
			}
			.rd-pex .v-selection-control__input .v-icon::before {
				content: "\F0131" !important;
				color: #00ACAC;
			}

			.rd-pex.error .v-selection-control__input .v-icon::before {
				content: "\F0131" !important;
				color: red;
			}
		}
		.dl-underline{
			text-decoration: unset;
			font-weight: bold;
		}
	}
</style>