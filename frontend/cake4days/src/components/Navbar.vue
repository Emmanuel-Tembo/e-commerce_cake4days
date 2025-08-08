<template>
  <nav class="bg-white shadow-md p-4 flex justify-between items-center z-50">
    <router-link to="/">
      <h1 class="text-2xl font-bold text-pink-600">Cake4Days</h1>
    </router-link>
    <div class="flex items-center gap-4">
      <router-link to="/profile" class="text-gray-600 hover:text-pink-600">Profile</router-link>
      <button @click="toggleCart" class="relative">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        <span v-if="totalItems > 0" class="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {{ totalItems }}
        </span>
      </button>
    </div>
  </nav>
</template>


<script>
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';

export default {
  name: 'Navbar',
  setup() {
    const cartStore = useCartStore();
    const { totalItems } = storeToRefs(cartStore);

    return {
      totalItems,
      toggleCart: cartStore.toggleCart,
    };
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #d60e3d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-image {
  height: 40px; 
}

.nav-icons {
  display: flex;
  gap: 1.5rem;
  align-items: center;

}

.nav-link {
  color: #333;
  font-size: 1.5rem;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ff69b4; 
}
</style>