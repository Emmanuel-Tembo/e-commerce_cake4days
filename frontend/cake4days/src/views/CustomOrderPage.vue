<template>
  <div class="custom-order-page">
    <HeroImage />
    <main class="content-wrapper">
      <h1 class="page-title">Create Your Dream Cake</h1>
      <OrderForm />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :price="product.price"
          :image="product.image"
          :description="product.description"
        />
      </div>
    </main>
  </div>
</template>

<script>
// No need to import Navbar, as it is in your App.vue file
import HeroImage from '../components/HeroImage.vue';
import OrderForm from '../components/OrderForm.vue';
import ProductCard from '../components/ProductCard.vue';
import { ref } from 'vue';

export default {
  name: 'CustomOrderPage',
  components: {
    HeroImage,
    OrderForm,
    ProductCard
  },
  setup() {
    const products = ref([
      {
        id: 1,
        name: "Chocolate Dream Cake",
        price: 350.00,
        image: "https://placehold.co/400x300/F5E0D5/333?text=Chocolate+Cake",
        description: "A rich, decadent chocolate cake with creamy ganache."
      },
      {
        id: 2,
        name: "Strawberry Shortcake",
        price: 280.00,
        image: "https://placehold.co/400x300/F5E0D5/333?text=Strawberry+Cake",
        description: "A light and fluffy cake with fresh strawberries."
      },
    ]);

    return {
      products
    };
  }
};
</script>

<style scoped>
.custom-order-page {
  font-family: 'Poppins', sans-serif;
  background-color: #fcf8f6; 
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}
</style>