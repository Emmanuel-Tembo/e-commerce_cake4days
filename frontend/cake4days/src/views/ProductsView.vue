<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Products Page</h1>

    <!-- Category Filter Buttons -->
    <div class="mb-4 text-center">
      <button
        class="btn btn-outline-primary m-1"
        :class="{ active: selectedCategory === null }"
        @click="selectedCategory = null"
      >
        All
      </button>
      <button
        v-for="category in categories"
        :key="category"
        class="btn btn-outline-primary m-1"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="row">
      <div 
        class="col-md-4 mb-4" 
        v-for="product in filteredProducts" 
        :key="product.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text"><strong>Price:</strong> R{{ product.price }}</p>
            <p class="card-text"><strong>Category:</strong> {{ product.category }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selectedCategory: null,
      categories: [
        'Cakes',
        'Cupcakes',
        'Macarons',
        'Muffins',
        'Scones',
        'Treats',
        'DogBiscuits',
        'PupCakes',
        'CatTreats',
        'CatCakes'
      ]
    }
  },
  computed: {
    ...mapState(['products']),
    
    filteredProducts() {
      if (!this.selectedCategory) {
        return this.products
      }
      return this.products.filter(
        product => product.category === this.selectedCategory
      )
    }
  },
  created() {
    this.$store.dispatch('fetchProducts')
  }
}
</script>

<style>
.products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  width: 250px;
  border-radius: 8px;
}

button.active {
  background-color: #0d6efd;
  color: white;
}
</style>
