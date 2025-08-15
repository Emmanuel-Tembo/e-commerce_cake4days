import { createRouter, createWebHistory } from 'vue-router'; 
import HomeView from '../views/HomeView.vue';
import CustomOrderPage from '../views/CustomOrderPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import CheckoutPage from '../views/CheckoutPage.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: CustomOrderPage
  },
  {
    path: '/custom-order',
    name: 'custom-order',
    component: CustomOrderPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
];

const router = createRouter({
  // This line requires the createWebHistory import to be present
  history: createWebHistory(),
  routes
});

export default router;

