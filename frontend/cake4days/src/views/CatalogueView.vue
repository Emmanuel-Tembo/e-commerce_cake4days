<template>
  <div class="app-container">
   <NavComp />
   <NavbarComp />
  

    <!-- Cart Dropdown -->
    <div v-if="showCart" class="cart-dropdown">
      <div class="cart-header">
        <h3>Shopping Cart</h3>
        <button @click="toggleCart" class="close-cart">×</button>
      </div>
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
        </div>
        <div v-else>
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="cart-item-info">
              <h4>{{ item.name }}</h4>
              <p class="cart-item-type">{{ item.type }}</p>
              <div class="cart-item-controls">
                <button @click="decreaseQuantity(item.id)" class="quantity-btn">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)" class="quantity-btn">+</button>
              </div>
            </div>
            <div class="cart-item-price">
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              <button @click="removeFromCart(item.id)" class="remove-btn">Remove</button>
            </div>
          </div>
          <div class="cart-total">
            <strong>Total: ${{ cartTotal.toFixed(2) }}</strong>
          </div>
          <button class="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>

    <!-- Catalog Content -->
    <section class="catalog-hero">
      <div class="hero-content">
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
      <div class="cake-grid">
        <div 
          class="cake-card" 
          v-for="cake in filteredCakes" 
          :key="cake.id"
          @click="viewCakeDetail(cake.id)"
        >
          <div class="cake-image">
            <img :src="cake.image" :alt="cake.name">
            <div class="cake-badge" v-if="cake.isNew">New!</div>
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
            <button class="add-to-cart-btn" @click.stop="addToCart(cake)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="filteredCakes.length === 0">
      <div class="empty-icon">
        <i class="fas fa-cake"></i>
      </div>
      <h3>No cakes match your search</h3>
      <p>Try adjusting your filters or search term</p>
      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
    </div>

    <div class="quick-view-modal" v-if="selectedCake" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-modal" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedCake.image" :alt="selectedCake.name">
          </div>
          <div class="modal-details">
            <h2>{{ selectedCake.name }}</h2>
            <p class="modal-description">{{ selectedCake.fullDescription }}</p>
            
            <div class="modal-meta">
              <div class="meta-item">
                <i class="fas fa-tag"></i>
                <span>{{ selectedCake.category }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-user-friends"></i>
                <span>Serves {{ selectedCake.serves }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ selectedCake.preparationTime }}</span>
              </div>
            </div>
            
            <div class="price-section">
              <span class="modal-price">${{ selectedCake.price.toFixed(2) }}</span>
              <button class="add-to-cart" @click="addToCart(selectedCake)">
                <i class="fas fa-shopping-cart"></i> Add to Cart
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
  </div>
</template>

<script>
import NavbarComp from '@/components/NavbarComp.vue';
import NavComp from '@/components/NavComp.vue';
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';

export default {
  name: 'CakeCatalog',
  components: {
    NavComp,
    NavbarComp,
  },
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
      cakes: [
          { id: 1, name: 'Chocolate Delight', category: 'birthday', price: 25.00, description: 'Rich chocolate cake with creamy frosting', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Classic-Chocolate.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains nuts, dairy' },
        { id: 2, name: 'Vanilla Dream', category: 'wedding', price: 30.00, description: 'Classic vanilla cake with buttercream icing', image: 'https://tessasbakery.co.za/wp-content/uploads/2024/08/Untitled-design-3.png', serves: 10, preparationTime: '3 hours', allergens: 'Contains dairy' },
        { id: 3, name: 'Red Velvet Bliss', category: 'custom', price: 28.50, description: 'Moist red velvet cake with cream cheese frosting', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Red-Velvet-1024x1024.jpg', serves: 6, preparationTime: '1.5 hours', allergens: 'Contains gluten, dairy' },
        { id: 4, name: 'Lemon Zest', category: 'seasonal', price: 22.00, description: 'Refreshing lemon cake with citrus glaze', image: 'https://tessasbakery.co.za/wp-content/uploads/2015/06/New_Lemon_Mer-1-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten' },
        { id: 5, name: 'Carrot Crunch', category: 'mini', price: 18.00, description: 'Spiced carrot cake with walnuts and cream cheese frosting', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVYxJDv7lEsZ3agTTeULKWi3P3NZ1Me4wg-g&s', serves: 4, preparationTime: '1 hour', allergens: 'Contains nuts' },
        {id: 6, name: 'carrot Cheese', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: '', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 7, name: 'Blue Velvet', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Blue-Velvet-Cakes-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 8, name: 'Chai Latte Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Chai_Cake-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 9, name: 'Chocolate Caramel Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_ChocCar-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 10, name: 'Death By Chocolate Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Death-by-Chocolate-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 11, name: 'Let It Go', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2017/04/4-1-700x700.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 12, name: 'Dusty Rose', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-DUSTYROSE-1-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 13, name: 'Blush Pink Fun-Size', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-FUNSIZE-PINK-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 14, name: 'Mini Lunchbox', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: '', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 15, name: 'Pink Rose Cascade Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://ohmycake.co.za/wp-content/uploads/2024/04/Pink-rose-cascade-cake-768x768.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 16, name: 'Sprinkle Baby Gift Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-10.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 17, name: 'Oreo Mini Gift Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-5-1-700x700.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 18, name: 'Nutella Mini Gift Cake ', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-7-1-700x700.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 19, name: 'Vegan Oreo Cake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Vegan_Oreo-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 20, name: 'Orea New York Baked CheeseCake', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2024/09/Untitled-design.zip-3-1-669x669.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 21, name: 'Unicorn Fun Size', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-FUNSIZE-UNICORNS-700x700.jpg', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
        {id: 22, name: 'Strawberry Fun Size', category: 'birthday', price: 26.00, description: 'Decadent chocolate fudge cake with ganache', image: 'https://tessasbakery.co.za/wp-content/uploads/2025/07/New-Product-Shots-Products-6.png', serves: 8, preparationTime: '2 hours', allergens: 'Contains gluten, dairy' },
    ]
    }
  },
  computed: {
    filteredCakes() {
      let cakes = this.cakes;
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        cakes = cakes.filter(cake => 
          cake.name.toLowerCase().includes(query) ||
          cake.description.toLowerCase().includes(query) ||
          cake.category.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (this.selectedCategory !== 'all') {
        cakes = cakes.filter(cake => cake.category === this.selectedCategory);
      }
      
      // Sort cakes
      switch (this.sortOption) {
        case 'price-asc':
          cakes.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          cakes.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          cakes.sort((a, b) => b.id - a.id); // Assuming higher IDs are newer
          break;
        default: // 'featured'
          cakes.sort((a, b) => a.id - b.id);
      }
      
      return cakes;
    }
  },
  methods: {
    applyFilters() {
      // Filters are applied reactively through computed property
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.sortOption = 'featured';
    },
    viewCakeDetail(cakeId) {
      this.selectedCake = this.cakes.find(cake => cake.id === cakeId);
    },
    closeModal() {
      this.selectedCake = null;
    },
    addToCart(cake) {
      // Now this works because this.cartStore is exposed by setup()
      this.cartStore.addToCart(cake)
      this.closeModal();
    }
  }
}
</script>

<style scoped>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-text {
  font-size: 1.8rem;
  color: #ff6b6b;
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
}

.logo-tagline {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 30px;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-bar {
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 30px;
  width: 250px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255,107,107,0.2);
}

.search-btn {
  background: none;
  border: none;
  position: absolute;
  left: 12px;
  cursor: pointer;
  color: #666;
}

.header-icons {
  display: flex;
  gap: 20px;
}

.icon {
  cursor: pointer;
  position: relative;
  color: #333;
  transition: color 0.3s ease;
}

.icon:hover {
  color: #ff6b6b;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;

}

/* Cart Dropdown Styles */
.cart-dropdown {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  background: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-radius: 8px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.cart-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-cart {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-cart:hover {
  color: #ff6b6b;
}

.cart-content {
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.empty-cart {
  text-align: center;
  padding: 20px;
  color: #666;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.cart-item-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #333;
}

.cart-item-type {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 10px 0;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background-color: #f5f5f5;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.cart-item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cart-item-price span {
  font-weight: 600;
  color: #333;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 5px;
  transition: opacity 0.2s ease;
}

.remove-btn:hover {
  opacity: 0.8;
}

.cart-total {
  text-align: right;
  padding: 15px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
  font-size: 1.1rem;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #e05555;
}

/* Responsive Header */
@media (max-width: 768px) {
  .top-header {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 15px;
  }
  
  .search-container {
    width: 100%;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .header-icons {
    align-self: flex-end;
  }
  
  .cart-dropdown {
    width: 90%;
    right: 5%;
  }
}
.empty-icon {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 20px;
}
/* Color Variables */
:root {
  --primary: #FF9AA2;
  --primary-dark: #E88B94;
  --secondary: #FFB7B2;
  --accent: #FFDAC1;
  --dark: #6B4D57;
  --light: #FFF9F4;
  --text: #333333;
  --gray: #EEEEEE;
}

/* Base Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.catalog-hero {
  background-color: var(--accent);
  padding: 80px 0;
  text-align: center;
  margin-bottom: 40px;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 15px;
}

.hero-content p {
  font-size: 1.2rem;
  color: var(--text);
}

/* Catalog Controls */
.catalog-controls {
  background-color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid var(--gray);
  border-radius: 30px;
  font-size: 1rem;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dark);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: var(--dark);
}

.filter-group select {
  padding: 8px 15px;
  border: 1px solid var(--gray);
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

/* Cake Grid */
.cake-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0 50px;
}

.cake-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.cake-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.cake-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.cake-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cake-card:hover .cake-image img {
  transform: scale(1.05);
}

.cake-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: var(--primary);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.cake-info {
  padding: 20px;
}

.cake-info h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--dark);
}

.cake-description {
  color: var(--text);
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cake-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

.serves {
  font-size: 0.8rem;
  color: var(--text);
}

.serves i {
  margin-right: 5px;
  color: var(--primary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 50px 20px;
}

.empty-state img {
  max-width: 200px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: var(--dark);
  margin-bottom: 10px;
}

.empty-state p {
  color: var(--text);
  margin-bottom: 20px;
}

.reset-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: var(--primary-dark);
}

/* Quick View Modal */
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text);
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.modal-image {
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
}

.modal-details h2 {
  color: var(--dark);
  margin-bottom: 15px;
}

.modal-description {
  color: var(--text);
  margin-bottom: 20px;
  line-height: 1.6;
}

.modal-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
}

.meta-item i {
  color: var(--primary);
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.add-to-cart {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.add-to-cart:hover {
  background-color: var(--primary-dark);
}

.allergens h4 {
  color: var(--dark);
  margin-bottom: 5px;
}

.allergens p {
  color: var(--text);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (min-width: 768px) {
  .modal-body {
    flex-direction: row;
  }
  
  .modal-image {
    flex: 1;
    height: auto;
  }
  
  .modal-details {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: 100%;
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