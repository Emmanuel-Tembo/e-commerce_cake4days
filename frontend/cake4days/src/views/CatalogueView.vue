<template>
  <div class="app-container">
   <NavComp />
   <NavbarComp />

    <section class="catalog-hero" :style="{
            backgroundImage: 'url(https://nugget-markets-01.s3.us-west-1.amazonaws.com/nugget/p/premium-cakes-group-2-eg1m461r2fahk66n.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '70px 0'

        }">
      <div class="hero-content" >
        <h1>Our Cake Collection</h1>
        <p>Discover delicious treats for every occasion</p>
      </div>
    </section>

    <div class="catalog-controls">
      <div class="container">
        <div class="filter-section">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search cakes..." 
              v-model="searchQuery"
              @input="applyFilters"
            >
            <i class="fas fa-search"></i>
          </div>
          
          <div class="filter-group">
            <label>Filter by:</label>
            <select v-model="selectedCategory" @change="applyFilters">
              <option value="all">All Categories</option>
              <option 
                v-for="category in categories" 
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortOption" @change="applyFilters">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div v-if="isLoading" class="loading-message">
        <p>Loading cakes...</p>
      </div>
      <div v-else-if="filteredCakes.length > 0" class="cake-grid">
        <div 
          class="cake-card" 
          v-for="cake in filteredCakes" 
          :key="cake.product_id"
          @click="viewCakeDetail(cake.product_id)"
        >
          <div class="cake-image">
            <img :src="cake.image_url" :alt="cake.name" @error="handleImageError">
          </div>
          <div class="cake-info">
            <h3>{{ cake.name }}</h3>
            <p class="cake-description">{{ cake.description }}</p>
            <div class="cake-meta">
              <span class="price">${{ cake.price.toFixed(2) }}</span>
              <span class="serves" v-if="cake.serves">
                <i class="fas fa-user-friends"></i> Serves {{ cake.serves }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-cake"></i>
        </div>
        <h3>No cakes match your search</h3>
        <p>Try adjusting your filters or search term</p>
        <button class="reset-btn" @click="resetFilters">Reset Filters</button>
      </div>
    </div>

    <div class="quick-view-modal" v-if="selectedCake" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-modal" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedCake.image_url" :alt="selectedCake.name">
          </div>
          <div class="modal-details">
            <h2>{{ selectedCake.name }}</h2>
            <p class="modal-description">{{ selectedCake.description }}</p>
            
            <div class="modal-meta">
              <div class="meta-item">
                <i class="fas fa-tag"></i>
                <span>{{ selectedCake.category }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-user-friends"></i>
                <span>Serves {{ selectedCake.serves }}</span>
              </div>
              </div>
            
            <div class="price-section">
              <span class="modal-price">${{ selectedCake.price.toFixed(2) }}</span>
              <button class="add-to-cart-btn" @click.stop="addToCart(selectedCake)">
              Add to Cart
            </button>
            </div>
            
            <div class="allergens" v-if="selectedCake.allergens">
              <h4>Allergens:</h4>
              <p>{{ selectedCake.allergens }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FootComp />
  </div>
</template>

<script>
import FootComp from '@/components/FootComp.vue';
import NavbarComp from '@/components/NavbarComp.vue';
import NavComp from '@/components/NavComp.vue';
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CakeCatalog',
  components: {
    NavComp,
    NavbarComp,
    FootComp
  },
  setup(){
    const cartStore = useCartStore();

    const { cartItems, totalItems, subtotal, isCartOpen } = storeToRefs(cartStore);

    const { toggleCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartStore;

    return {
      cartItems,
      totalItems,
      subtotal,
      isCartOpen,
      toggleCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      cartStore,
    };
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      sortOption: 'featured',
      selectedCake: null,
      categories: [
        { value: 'birthday', label: 'Birthday Cakes' },
        { value: 'wedding', label: 'Wedding Cakes' },
        { value: 'custom', label: 'Custom Designs' },
        { value: 'seasonal', label: 'Seasonal Specials' },
        { value: 'mini', label: 'Mini Cakes' }
      ],
      isLoading: true,
    }
  },
  computed: {
    ...mapState(['humanProducts']),
    filteredCakes() {
      let cakes = this.humanProducts;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        cakes = cakes.filter(cake => 
          cake.name.toLowerCase().includes(query) ||
          cake.description.toLowerCase().includes(query) ||
          (cake.category && cake.category.toLowerCase().includes(query))
        );
      }
      
      if (this.selectedCategory !== 'all') {
        cakes = cakes.filter(cake => cake.category === this.selectedCategory);
      }
      
      switch (this.sortOption) {
        case 'price-asc':
          cakes.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          cakes.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          cakes.sort((a, b) => b.product_id - a.product_id);
          break;
        default: // 'featured'
          cakes.sort((a, b) => a.product_id - b.product_id);
      }
      
      return cakes;
    }
  },
  methods: {
    ...mapActions(['fetchHumanProducts']),
    applyFilters() {
      // Filters are applied reactively through computed property
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.sortOption = 'featured';
    },
    viewCakeDetail(cakeId) {
      this.selectedCake = this.humanProducts.find(cake => cake.product_id === cakeId);
    },
    closeModal() {
      this.selectedCake = null;
    },
    handleImageError(event) {
        event.target.style.display = 'none';
        const fallbackIcon = document.createElement('i');
        fallbackIcon.className = 'fas fa-birthday-cake fallback-icon';
        event.target.parentNode.appendChild(fallbackIcon);
    },
    addToCart(cake) {
      this.cartStore.addToCart(cake);
      this.closeModal();
    },
  },
  created() {
    this.fetchHumanProducts()
        .then(() => {
            this.isLoading = false;
        })
        .catch(error => {
            console.error("Failed to fetch human cakes:", error);
            this.isLoading = false;
        });
  }
}
</script>

<style scoped>
/* Base Styles */
.app-container {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f2e8; /* Soft, warm beige background */
  color: #333;
}

/* Sticky Header and Controls */
.nav-container {
    position: sticky;
    top: 0;
    z-index: 99;
    width: 100%;
}

/* Catalog Hero Section */
.catalog-hero {
  position: relative;
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1579737198895-36528731336d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.catalog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  z-index: 10;
  color: white;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.hero-content p {
  font-size: 1.25rem;
  font-weight: 400;
}

/* Catalog Controls and Filters */
.catalog-controls {
  background-color: #f0e6d6; /* A slightly darker beige for the filter bar */
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky; /* Make the nav sticky */
  top: 0; /* Stick to the top of the viewport */
  z-index: 50; /* Ensure it stays above the content */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border-radius: 25px;
  border: 1px solid #ddd;
  background-color: white;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #795548; /* Brown border */
  box-shadow: 0 0 0 3px rgba(121, 85, 72, 0.2);
}

.search-box .fas {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #795548; /* Brown icon */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #555;
}

.filter-group select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-group select:hover {
  border-color: #795548; /* Brown border on hover */
}

/* Cake Grid & Cards */
.cake-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
  padding-bottom: 40px;
}

.cake-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #795548; /* Brown outline around the card */
}

.cake-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(245, 222, 179, 0.7); /* Subtle beige glow on hover */
}

.cake-image {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
  background-color: #f8f3eb;
}

.cake-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cake-card:hover img {
  transform: scale(1.05);
}

.cake-info {
  padding: 20px;
}

.cake-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #795548; /* Brown heading */
  margin-bottom: 5px;
}

.cake-description {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 15px;
  min-height: 40px;
}

.cake-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4b352a; /* Darker brown for price */
}

.serves {
  font-size: 0.9rem;
  color: #555;
}

.serves .fas {
  color: #795548; /* Brown icon */
  margin-right: 5px;
}

/* Empty State */
.loading-message, .empty-state {
  text-align: center;
  padding: 50px 0;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #795548; /* Brown heading */
  margin-bottom: 10px;
}

.empty-state .empty-icon {
  font-size: 3rem;
  color: #c2b280; /* Beige icon */
  margin-bottom: 10px;
}

.reset-btn {
  background-color: #c2b280; /* Beige button */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #795548; /* Brown hover */
}

/* Quick View Modal (Optimized) */
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
  transition: color 0.3s;
  z-index: 10;
}

.close-modal:hover {
  color: #795548; /* Brown hover */
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.modal-image {
  flex-shrink: 0;
  height: 300px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details {
  padding: 30px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.modal-details h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #795548; /* Brown heading */
  margin-bottom: 10px;
}

.modal-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
}

.modal-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #777;
}

.meta-item .fas {
  color: #c2b280; /* Beige icon */
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.modal-price {
  font-size: 2rem;
  font-weight: 700;
  color: #4b352a; /* Darker brown for price */
}

.add-to-cart-btn {
  background-color: #c2b280; /* Beige button */
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #795548; /* Brown hover */
}

.allergens h4 {
  color: #795548; /* Brown heading */
  margin-bottom: 5px;
}

.allergens p {
  color: #777;
  font-size: 0.9rem;
}

/* Fallback for broken images */
.fallback-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: #ccc;
}

/* Responsive Design */
@media (min-width: 768px) {
  .modal-body {
    flex-direction: row;
    height: 500px;
  }
  
  .modal-image {
    flex: 1;
    height: auto;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-right-radius: 0;
  }
  
  .modal-details {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
    max-width: none;
  }
  
  .filter-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .cake-grid {
    grid-template-columns: 1fr;
  }
}
</style>