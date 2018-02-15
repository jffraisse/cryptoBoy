// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import VueResource from 'vue-resource';
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.use(VueResource);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  http: {
    root: '/root'
  },
  template: '<App/>',
  components: { App },
});
