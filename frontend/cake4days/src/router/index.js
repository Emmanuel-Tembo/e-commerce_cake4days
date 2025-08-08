
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
    path: '/products',
    name: 'products',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/ProductsView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
