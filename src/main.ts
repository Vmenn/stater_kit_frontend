import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import './styles/main.css'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search...',
        noData: 'No data available',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Full Name',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        verifyEmail: 'Verify Email',
        resendVerification: 'Resend Verification',
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueApexCharts)
app.mount('#app')
