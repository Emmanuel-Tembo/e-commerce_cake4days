import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import signView from '@/views/signView.vue'
import CatalogueView from '@/views/CatalogueView.vue'
import CartView from '@/views/CartView.vue'
import PetTreatsView from '@/views/PetTreatsView.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import CustomOrderPage from '../views/CustomOrderPage.vue'
import merchView from '@/views/merchView.vue'
import aboutView from '@/views/aboutView.vue'
import PaymenView from '@/views/paymenView.vue'
import OrderConfirm from '@/views/orderConfirm.vue'
import ReturnsView from '@/views/ReturnsView.vue'
import ShippingView from '@/views/ShippingView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import FaqView from '@/views/FaqView.vue'




const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: aboutView
  },
  {
    path: '/PetTreats',
    name: 'PetTreats',
    component: PetTreatsView
  },
 {
    path: '/merch',
    name: 'merch',
    component: merchView
  },
  {
    path: '/sign',
    name: 'sign',
    component: signView
  },
  {
    path: '/order-confirmation',
    name: 'order confirmation',
    component: OrderConfirm
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: CatalogueView
  },
  {
    path: '/Cart',
    name: 'Cart',
    component: CartView
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPassword
  },
  {
    path: '/custom-order',
    name: 'customOrder',
    component: CustomOrderPage
  },
  {
    path: '/payment/checkout',
    name: 'Payment',
    component: PaymenView
  },
  {
    path: '/returns',
    name: 'returns',
    component: ReturnsView
  },
  {
    path: '/shipping',
    name: 'shipping',
    component: ShippingView
  },
  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: PrivacyPolicyView
  },
  {
    path: '/faq',
    name: 'faq',
    component: FaqView
  },
];
    


// Create the router instance with the history mode and routes
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;