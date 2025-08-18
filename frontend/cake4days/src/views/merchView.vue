<template>
  
  <div class="merch-page">
    <NavComp/>
    <NavbarComp/>
    <!-- Hero Section -->
    <div class="hero-section" style="background-image: url('https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')">
      <div class="hero-content">
        <h1>Pawsome Merchandise</h1>
        <p>Show your love for pets with our adorable collection</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Category Filters -->
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

      <!-- Merch Grid -->
      <div class="merch-grid">
        <div 
          v-for="item in filteredMerch" 
          :key="item.id" 
          class="merch-card"
          @click="selectItem(item)"
        >
          <div class="merch-image">
            <img :src="item.image" :alt="item.name" @error="handleImageError">
            <div v-if="item.onSale" class="sale-badge">SALE</div>
          </div>
          <div class="merch-info">
            <h3>{{ item.name }}</h3>
            <p class="merch-type">{{ item.type }}</p>
            <div class="price-section">
              <span class="price" :class="{ 'old-price': item.onSale }">R{{ item.price.toFixed(2) }}</span>
              <span v-if="item.onSale" class="sale-price">R{{ (item.price * 0.8).toFixed(2) }}</span>
            </div>
            <button class="add-to-cart" @click.stop="addToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="selectedItem" class="quick-view-modal">
      <div class="modal-content">
        <span class="close-modal" @click="closeModal">&times;</span>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedItem.image" :alt="selectedItem.name">
          </div>
          <div class="modal-details">
            <h2>{{ selectedItem.name }}</h2>
            <p class="item-type">{{ selectedItem.type }}</p>
            <p class="item-description">{{ selectedItem.description }}</p>
            
            <div class="price-section">
              <span class="price" :class="{ 'old-price': selectedItem.onSale }">
                R{{ selectedItem.price.toFixed(2) }}
              </span>
              <span v-if="selectedItem.onSale" class="sale-price">
                R{{ (selectedItem.price * 0.8).toFixed(2) }}
              </span>
            </div>

            <div class="size-selector" v-if="selectedItem.sizes">
              <label>Size:</label>
              <select v-model="selectedSize">
                <option v-for="size in selectedItem.sizes" :value="size">{{ size }}</option>
              </select>
            </div>

            <div class="quantity-selector">
              <label>Quantity:</label>
              <button @click="quantity > 1 ? quantity-- : null">-</button>
              <span>{{ quantity }}</span>
              <button @click="quantity++">+</button>
            </div>

            <button class="add-to-cart" @click="addSelectedToCart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarComp from '@/components/NavbarComp.vue';
import NavComp from '@/components/NavComp.vue';
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';

export default {
  components: {
    NavComp,
    NavbarComp,
  },
  name: 'MerchPage',
  setup(){
    const cartStore = useCartStore();

    // Use storeToRefs to get reactive references to state properties
    const { cartItems, totalItems, subtotal, isCartOpen } = storeToRefs(cartStore);

    // Get actions directly from the store
    const { toggleCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartStore;

    return {
      // Expose all necessary state and actions to the template
      cartItems,
      totalItems,
      subtotal,
      isCartOpen,
      toggleCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      cartStore, // <--- EXPOSE THE CART STORE HERE
    };
  },
  data() {
    return {
      selectedCategory: 'All',
      selectedItem: null,
      selectedSize: null,
      quantity: 1,
      categories: ['All', 'Apparel', 'Accessories', 'Home', 'Gifts'],
      merchItems: [
        {
          id: 1,
          name: 'Paw Print T-Shirt',
          type: 'Apparel',
          price: 249.99,
          description: 'Comfortable cotton t-shirt with cute paw print design',
          image: 'data:image/jpeg;base64,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',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          onSale: true
        },
        {
          id: 2,
          name: 'Pet Lover Mug',
          type: 'Home',
          price: 149.99,
          description: 'Ceramic mug with "Dog Mom/Dad" text and bone design',
          image: 'https://m.media-amazon.com/images/I/71QN+4YrZAL._AC_UL1500_.jpg'
        },
        {
          id: 3,
          name: 'Pet Bandana',
          type: 'Accessories',
          price: 99.99,
          description: 'Adjustable cotton bandana for your furry friend',
          image: 'https://m.media-amazon.com/images/I/81t5Wj+UfVL._AC_UL1500_.jpg',
          colors: ['Red', 'Blue', 'Green']
        },
        {
          id: 4,
          name: 'Pet Portrait Pillow',
          type: 'Home',
          price: 349.99,
          description: 'Customizable pillow with your pet\'s portrait',
          image: 'https://m.media-amazon.com/images/I/71QN+4YrZAL._AC_UL1500_.jpg',
          onSale: true
        },
        {
          id: 5,
          name: 'Dog Paw Socks',
          type: 'Apparel',
          price: 129.99,
          description: 'Comfy socks with cute dog paw designs',
          image: 'https://m.media-amazon.com/images/I/71QN+4YrZAL._AC_UL1500_.jpg',
          sizes: ['S/M', 'L/XL']
        },
        {
          id: 6,
          name: 'Pet Memorial Keychain',
          type: 'Gifts',
          price: 79.99,
          description: 'Beautiful keychain to remember your beloved pet',
          image: 'https://m.media-amazon.com/images/I/71QN+4YrZAL._AC_UL1500_.jpg'
        }
      ],
      cartItems: []
    }
  },
  computed: {
    filteredMerch() {
      if (this.selectedCategory === 'All') {
        return this.merchItems;
      }
      return this.merchItems.filter(item => item.type === this.selectedCategory);
    }
  },
  methods: {
    filterByCategory(category) {
      this.selectedCategory = category;
    },
    selectItem(item) {
      this.selectedItem = item;
      this.selectedSize = item.sizes ? item.sizes[0] : null;
      this.quantity = 1;
    },
    addToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          ...item,
          quantity: 1,
          selectedSize: item.sizes ? item.sizes[0] : null
        });
      }
      this.showToast(`${item.name} added to cart!`);
    },
    addSelectedToCart() {
      this.addToCart({
        ...this.selectedItem,
        selectedSize: this.selectedSize,
        quantity: this.quantity
      });
      this.selectedItem = null;
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x300?text=Merch+Image';
    },
    showToast(message) {
      // You would implement a toast notification here
      console.log(message);
    },
    closeModal() {
      this.selectedItem = null;
    }
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