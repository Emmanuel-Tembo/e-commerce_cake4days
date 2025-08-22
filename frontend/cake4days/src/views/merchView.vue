<template>
  <div class="merch-page">
    <NavComp/>
    <NavbarComp/>
    <div class="hero-section" style="background-image: url('https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')">
      <div class="hero-content">
        <h1>Pawsome Merchandise</h1>
        <p>Show your love for pets with our adorable collection</p>
      </div>
    </div>

    <div class="container">
      <div class="category-filters">
        <button 
          v-for="category in categories" 
          :key="category" 
          @click="filterByCategory(category)"
          :class="{ active: selectedCategory === category }"
        >
          {{ category }}
        </button>
      </div>

      <div v-if="isLoading" class="loading-message">
        <p>Loading merchandise...</p>
      </div>
      <div v-else-if="filteredMerch.length > 0" class="merch-grid">
        <div 
          v-for="item in filteredMerch" 
          :key="item.product_id" 
          class="merch-card"
          @click="selectItem(item)"
        >
          <div class="merch-image">
            <img :src="item.image_url" :alt="item.name" @error="handleImageError">
            <div v-if="item.is_on_sale" class="sale-badge">SALE</div>
          </div>
          <div class="merch-info">
            <h3>{{ item.name }}</h3>
            <p class="merch-type">{{ item.category }}</p>
            <div class="price-section">
              <span class="price" :class="{ 'old-price': item.is_on_sale }">R{{ item.price.toFixed(2) }}</span>
              <span v-if="item.is_on_sale" class="sale-price">R{{ (item.price * 0.8).toFixed(2) }}</span>
            </div>
            <!-- <button class="add-to-cart" @click.stop="addToCartDirectly(item)">
              Add to Cart
            </button> -->
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-paw"></i>
        </div>
        <h3>No merchandise found</h3>
        <p>Try adjusting your filters.</p>
      </div>
    </div>

    <div v-if="selectedItem" class="quick-view-modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close-modal" @click="closeModal">&times;</span>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedItem.image_url" :alt="selectedItem.name">
          </div>
          <div class="modal-details">
            <h2>{{ selectedItem.name }}</h2>
            <p class="item-type">{{ selectedItem.category }}</p>
            <p class="item-description">{{ selectedItem.description }}</p>
            
            <div class="price-section">
              <span class="price" :class="{ 'old-price': selectedItem.is_on_sale }">
                R{{ selectedItem.price.toFixed(2) }}
              </span>
              <span v-if="selectedItem.is_on_sale" class="sale-price">
                R{{ (selectedItem.price * 0.8).toFixed(2) }}
              </span>
            </div>

            <div class="size-selector" v-if="selectedItem.sizes">
              <label>Size:</label>
              <select v-model="selectedSize">
                <option v-for="size in selectedItem.sizes.split(',')" :value="size">{{ size }}</option>
              </select>
            </div>
            
            <div class="color-selector" v-if="selectedItem.colors">
              <label>Color:</label>
              <select v-model="selectedColor">
                <option v-for="color in selectedItem.colors.split(',')" :value="color">{{ color }}</option>
              </select>
            </div>

            <div class="quantity-selector">
              <label>Quantity:</label>
              <button @click="quantity > 1 ? quantity-- : null">-</button>
              <span>{{ quantity }}</span>
              <button @click="quantity++">+</button>
            </div>

            <button class="add-to-cart" @click="addToCartFromModal(selectedItem)">
              Add to Cart
            </button>
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
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    NavComp,
    NavbarComp,
    FootComp
  },
  name: 'MerchPage',
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
      cartStore // Make cartStore available in the component's methods
    };
  },
  data() {
    return {
      selectedCategory: 'All',
      selectedItem: null,
      selectedSize: null,
      selectedColor: null,
      quantity: 1,
      categories: ['All', 'Apparel', 'Home', 'Accessories', 'Gifts'],
      isLoading: true
    };
  },
  computed: {
    ...mapState(['podProducts']),
    filteredMerch() {
      let items = this.podProducts;
      if (this.selectedCategory !== 'All') {
        items = items.filter(item => item.category === this.selectedCategory);
      }
      return items;
    }
  },
  methods: {
    ...mapActions(['fetchPodProducts']),
    filterByCategory(category) {
      this.selectedCategory = category;
    },
    selectItem(item) {
      this.selectedItem = item;
      // Set default selected options
      this.selectedSize = item.sizes ? item.sizes.split(',')[0] : null;
      this.selectedColor = item.colors ? item.colors.split(',')[0] : null;
      this.quantity = 1;
    },
    addToCartDirectly(item) {
      // For the grid view, add 1 item with no specific options
      this.cartStore.addToCart({ 
        ...item, 
        quantity: 1
      });
    },
    addToCartFromModal(item) {
      // For the modal view, add the selected options and quantity
      this.cartStore.addToCart({ 
        ...item, 
        selectedSize: this.selectedSize,
        selectedColor: this.selectedColor,
        quantity: this.quantity
      });
      this.closeModal();
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x300?text=Merch+Image';
    },
    closeModal() {
      this.selectedItem = null;
    }
  },
  created() {
    this.fetchPodProducts().then(() => {
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }
}
</script>

<style scoped>

/* Main Page Layout */
.merch-page {
  font-family: 'Poppins', sans-serif;
  background-color: #f7f3f0; /* Soft, light background */
  color: #333;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.hero-section::before {
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
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 1.25rem;
  font-weight: 400;
}

/* Main Container and Filters */
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.category-filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.category-filters button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-filters button:hover {
  background-color: #e2d9d1;
}

.category-filters button.active {
  background-color: #f19bbd;
  color: white;
  border-color: #f19bbd;
}

/* Merchandise Grid */
.merch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.merch-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.merch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.merch-image {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
}

.merch-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f19bbd;
  color: white;
  padding: 4px 10px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.8rem;
  z-index: 5;
}

.merch-info {
  padding: 20px;
}

.merch-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.merch-type {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 15px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.old-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
  font-weight: 400;
}

.sale-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e91e63;
}

/* Empty State and Loading */
.loading-message, .empty-state {
  text-align: center;
  padding: 50px 0;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 10px;
}

/* Quick View Modal (Corrected and Unified) */
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
  display: flex;
  flex-direction: column;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 2rem;
  color: #555;
  cursor: pointer;
  z-index: 10;
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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
  color: #333;
  margin-bottom: 10px;
}

.item-type {
  font-size: 1rem;
  color: #777;
  margin-bottom: 15px;
}

.item-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
}

.size-selector,
.color-selector {
  margin-bottom: 20px;
}

.size-selector label,
.color-selector label {
  font-weight: 600;
  margin-right: 10px;
}

.size-selector select,
.color-selector select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.quantity-selector button {
  background-color: #eee;
  border: 1px solid #ddd;
  color: #555;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-selector button:hover {
  background-color: #ddd;
}

.quantity-selector span {
  font-size: 1.2rem;
  font-weight: 600;
}

.add-to-cart {
  background-color: #f19bbd;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: auto;
}

.add-to-cart:hover {
  background-color: #e91e63;
}

/* Media Queries for Responsiveness */
@media (min-width: 768px) {
  .modal-body {
    flex-direction: row;
    height: 600px;
  }
  
  .modal-image {
    flex: 1;
    height: auto;
    border-radius: 20px 0 0 20px;
  }
  
  .modal-details {
    flex: 1;
  }
  
  .modal-image img {
    border-top-right-radius: 0;
    border-bottom-left-radius: 20px;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .merch-grid {
    grid-template-columns: 1fr;
  }
}

</style>