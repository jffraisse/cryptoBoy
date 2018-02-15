import Vue from 'vue';
import Router from 'vue-router';
import CryptoList from '@/components/CryptoList';
import CryptoView from '@/components/CryptoView';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CryptoList',
      component: CryptoList,
    },
    {
      path: '/:id',
      name: 'CryptoView',
      component: CryptoView,
    },
  ],
  mode: 'history'
});
