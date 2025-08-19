<template>
  <NavComp />
  <NavbarComp />
  <div class="custom-order-page">
    <HeroImage />
    <main class="content-wrapper">
      <h1 class="page-title">Create Your Dream Cake</h1>
      <OrderForm />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
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
  <FootComp />
</template>

<script>
// No need to import Navbar, as it is in your App.vue file
import NavComp from '@/components/NavComp.vue';
import HeroImage from '../components/HeroImage.vue';
import OrderForm from '../components/OrderForm.vue';
import ProductCard from '../components/ProductCard.vue';
import { ref } from 'vue';
import NavbarComp from '@/components/NavbarComp.vue';
import FootComp from '@/components/FootComp.vue';

export default {
  name: 'CustomOrderPage',
  components: {
    HeroImage,
    OrderForm,
    ProductCard,
    NavComp,
    NavbarComp,
    FootComp
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
  background-color: #e9deae; 
  min-height: 100vh;
  padding: 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(#d38328, #f49d9dd5);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 238, 0, 0.927);
  color: #333;
}

.page-title {
  text-align: center;
  color: #ffeb38;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255, 0, 162, 0.899);
  font-family: 'Poppins', cu;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding: 1rem;
}
</style>