import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import signView from '@/views/signView.vue'
import CatalogueView from '@/views/CatalogueView.vue'
import CartView from '@/views/CartView.vue'
import PetTreatsView from '@/views/PetTreatsView.vue'
import merchView from '@/views/merchView.vue'
import aboutView from '@/views/aboutView.vue'



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
    path: '/merch',
    name: 'merch',
    component: merchView
  },
  //  {
  //    path: '/about',
  //    name: 'about',
  // //   // route level code-splitting
  // //   // this generates a separate chunk (about.[hash].js) for this route
  // //   // which is lazy-loaded when the route is visited.
  //    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
