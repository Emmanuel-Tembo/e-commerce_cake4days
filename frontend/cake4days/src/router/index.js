
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomOrderPage from '../views/CustomOrderPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import CheckoutPage from '../views/CheckoutPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: CustomOrderPage // HomeView
  },
  {
    path: '/custom-order',
    name: 'custom-order',
    component: CustomOrderPage
  },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage // ProfilePage
    },
    {path: '/checkout',
      name: 'Checkout',
      component: CheckoutPage // CheckoutPage
    }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
