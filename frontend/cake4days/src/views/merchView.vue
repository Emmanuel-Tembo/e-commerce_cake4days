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
.merch-page {
  font-family: 'Poppins', sans-serif;
  background: #fff5f7;
  min-height: 100vh;
}

.hero-section {
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(210, 60, 103, 0.3);
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.category-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-filters button {
  background: white;
  border: 1px solid #d23c67;
  color: #d23c67;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.category-filters button:hover,
.category-filters button.active {
  background: #d23c67;
  color: white;
}

.merch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.merch-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(210, 60, 103, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.merch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(210, 60, 103, 0.2);
}

.merch-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.merch-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.merch-card:hover .merch-image img {
  transform: scale(1.05);
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff6b8b;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.merch-info {
  padding: 1.5rem;
}

.merch-info h3 {
  color: #d23c67;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.merch-type {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.sale-price {
  font-weight: bold;
  color: #d23c67;
  font-size: 1.1rem;
}

.add-to-cart {
  width: 100%;
  background: #ff6b8b;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart:hover {
  background: #d23c67;
}

/* Quick View Modal */
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 80%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 25px;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-modal:hover {
  color: #d23c67;
}

.modal-body {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.modal-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details {
  width: 100%;
}

.modal-details h2 {
  color: #d23c67;
  margin-bottom: 0.5rem;
}

.item-type {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.item-description {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.size-selector,
.quantity-selector {
  margin-bottom: 1.5rem;
}

.size-selector select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-left: 0.5rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector button {
  background: #ff6b8b;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-selector button:hover {
  background: #d23c67;
}

.quantity-selector span {
  min-width: 30px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .modal-body {
    flex-direction: column;
  }
  
  .modal-image {
    height: 200px;
  }
  
  .category-filters {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .merch-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>