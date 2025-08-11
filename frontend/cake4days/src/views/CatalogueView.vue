<template>
  <div>
    <h1>Our Delicious Cakes</h1>
    <section>
      <CardComp
        v-for="product in products"
        :key="product.id"
        :catalogue="product"
      />
    </section>
  </div>
</template>

<script>
import CardComp from '@/components/CardComp.vue';

export default {
  components: {
    CardComp
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Classic Chocolate Cake",
          description: "Rich and moist chocolate cake with creamy chocolate frosting. Perfect for any celebration.",
          price: 45.99,
          category: "Chocolate Cakes",
          imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
        },
        {
          id: 2,
          name: "Vanilla Birthday Cake",
          description: "Light and fluffy vanilla sponge cake with buttercream frosting and colorful sprinkles.",
          price: 42.00,
          category: "Birthday Cakes",
          imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop"
        },
        {
          id: 3,
          name: "Red Velvet Cake",
          description: "Classic red velvet cake with cream cheese frosting. A timeless favorite with a beautiful red color.",
          price: 48.95,
          category: "Specialty Cakes",
          imageUrl: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop"
        },
        {
          id: 4,
          name: "Lemon Drizzle Cake",
          description: "Fresh and zesty lemon cake with a tangy lemon glaze. Light, moist, and bursting with citrus flavor.",
          price: 38.50,
          category: "Fruit Cakes",
          imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
        },
        {
          id: 5,
          name: "Strawberry Shortcake",
          description: "Layers of vanilla sponge with fresh strawberries and whipped cream. A perfect summer treat.",
          price: 52.00,
          category: "Fruit Cakes",
          imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop"
        },
        {
          id: 6,
          name: "Black Forest Cake",
          description: "Traditional German cake with chocolate sponge, cherries, and whipped cream. A classic indulgence.",
          price: 55.99,
          category: "Specialty Cakes",
          imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop"
        }
      ]
    }
  }
}
</script>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin: 2rem 0;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  section {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
    margin: 1.5rem 0;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
}
</style>