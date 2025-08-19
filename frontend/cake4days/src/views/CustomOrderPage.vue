<template>
  <NavComp />
  <NavbarComp />
  <div class="custom-order-page">
    <HeroImage />
    <main class="content-wrapper">
      <OrderForm />
      <div class="product-grid">
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
import NavComp from '@/components/NavComp.vue';
import NavbarComp from '@/components/NavbarComp.vue';
import HeroImage from '../components/HeroImage.vue';
import OrderForm from '../components/OrderForm.vue';
import ProductCard from '../components/ProductCard.vue';
import { ref } from 'vue';
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
      {
        id: 3,
        name: "Red Velvet Bliss",
        price: 320.00,
        image: "https://placehold.co/400x300/F5E0D5/333?text=Red+Velvet+Cake",
        description: "A classic red velvet cake with delicious cream cheese frosting."
      }
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
  background-color: #f8f1e9;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #FFE5EC, #FFC0CB);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
}

.page-title {
  text-align: center;
  color: #D23C67;
  font-size: 2.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0;
  margin-bottom: 2rem;
}



.product-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>