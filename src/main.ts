import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import naive from "naive-ui"
import VueQrcode from "@chenfengyuan/vue-qrcode"
import VueApexCharts from "vue3-apexcharts";
import { createPinia } from "pinia"
import filters from "./helpers/filters"
import "leaflet/dist/leaflet.css"
import "./styles/index.css"
import { install as GoogleRecaptcha } from "vue3-recaptcha-v2";

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(naive)
app.use(pinia)
app.component(VueQrcode.name, VueQrcode)
app.use(VueApexCharts);

app.use(GoogleRecaptcha, {
  sitekey: import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY,
})

const plugins = import.meta.glob("./plugins/*.ts", {
    eager: true,
})

Object.values(plugins).forEach((module: any) => {
    app.use(module.default)
})

app.config.globalProperties.$filters = filters

app.mount("#app")
