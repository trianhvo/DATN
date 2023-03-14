import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import VueCookies from 'vue-cookies'

Vue.prototype.$http = Axios;

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['auth-token'] = token
}

Vue.config.productionTip = false
Vue.use(VueCookies)

const VCalendar = new Vue({
  router,
  store,
  vuetify,
  VueCookies,
  render: h => h(App)
}).$mount('#app')

export default VCalendar;
