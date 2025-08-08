<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
    <img :src="image" :alt="name" class="w-full h-48 object-cover" />
    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ name }}</h3>
      <p class="text-gray-600 mb-4 text-sm">{{ description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold text-pink-600">R{{ price.toFixed(2) }}</span>
        <button
          @click="addToCart({ id, name, price, image })"
          class="bg-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/store/cart';

export default {
  name: 'ProductCard',
  props: {
    id: Number,
    name: String,
    price: Number,
    image: String,
    description: String,
  },
  setup(props) {
    const cartStore = useCartStore();
    const { addToCart } = cartStore;

    return {
      addToCart,
    };
  }
};
</script>
