<template>
  <div :class="`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-500 ease-in-out z-[100] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800">Your Cart ({{ totalItems }})</h2>
        <button @click="toggleCart" class="text-gray-500 hover:text-pink-600 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="cartItems.length > 0">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0">
            </div>
        </div>
        <p v-else class="text-center text-gray-500">Your cart is empty.</p>
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200">
        <div class="flex justify-between items-center mb-4 text-xl font-bold text-gray-800">
          <span>Subtotal:</span>
          <span>R{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="grid gap-2">
          <button @click="toggleCart" class="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-full font-semibold hover:bg-gray-300">
            Continue Shopping
          </button>
          <router-link to="/checkout" @click="toggleCart" class="w-full bg-pink-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-pink-900 text-center">
            Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';

export default {
  name: 'CartSidebar',
  setup() {
    const cartStore = useCartStore();

    // Use storeToRefs to get reactive references to state properties
    const { isCartOpen, cartItems, subtotal, totalItems } = storeToRefs(cartStore);

    // Get actions directly from the store
    const { toggleCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartStore;

    return {
      isCartOpen,
      cartItems,
      subtotal,
      toggleCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
    };
  }
};
</script>

<style scoped>
/* No additional styles needed because we are using Tailwind CSS utility classes */
</style>