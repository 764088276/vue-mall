// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './routers'
import vuexStore from './store'
import base from './base'
import filters from './filters'

Vue.config.productionTip = false;

for(let i in filters){
  Vue.filter(i,filters[i]);
}

/* eslint-disable no-new */
let vue=new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store: vuexStore,
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
});
Vue.use(base);
