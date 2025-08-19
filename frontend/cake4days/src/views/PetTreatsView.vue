<template>
    <NavComp />
    <NavbarComp />
    <div class="container-fluid">
        
                <div class="cart-content">
                    <div v-if="cartItems.length > 0">
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
        <div class="background-section"
        :style="{
             backgroundImage: 'url(https://www.cakesforpets.fr/cdn/shop/files/AA.jpg?v=1745007535&width=3840)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      padding: '70px 0' 
    
        }">
        <section class="hero-section">
            <div class="hero-content">
                <h1>Delicious Cakes For Your Furry Friends</h1>
                <p>Premium quality pet cakes made with natural ingredients your pets will love</p>
                <button class="shop-button">Shop Now</button>
            </div>
        </section>
        </div>

        <main class="main-layout">
            <aside class="sidebar">
                <h3>categories</h3>
                <ul class="category-list">
                    <li><a href="#" @click.prevent="filterByCategory('Dog Cakes')">Dog Cakes</a></li>
                    <li><a href="#" @click.prevent="filterByCategory('Cat Cakes')">Cat Cakes</a></li>
                    <li><a href="#" @click.prevent="filterByCategory('Bird Cakes')">Bird Cakes</a></li>
                    <li><a href="#" @click.prevent="filterByCategory('Training Cakes')">Training Cakes</a></li>
                    <li><a href="#" @click.prevent="showAllProducts">Show All</a></li>
                </ul>
                <div class="price-filter">
                    <h4>Price Range</h4>
                    <label><input type="checkbox" v-model="priceFilters" value="under300">Under R300</label>
                    <label><input type="checkbox" v-model="priceFilters" value="300to650">R300 - R650</label>
                    <label><input type="checkbox" v-model="priceFilters" value="over650">Over R650</label>
                </div>
            </aside>
            
            <section class="product-grid">
                <div class="grid-header">
                    <h2>Pet Cakes</h2>
                    <p v-if="!isLoading">Showing {{ filteredProducts.length }} cakes</p>
                    <div v-if="searchTerm" class="search-info">
                        <p>Search results for: "<strong>{{ searchTerm }}</strong>"</p>
                        <button @click="clearSearch" class="clear-search">Clear Search</button>
                    </div>
                </div>
                
                <!-- Display a loading message while data is being fetched -->
                <div v-if="isLoading" class="loading-message">
                    <p>Loading products...</p>
                </div>

                <!-- Display products once they are loaded and not empty -->
                <div v-else-if="filteredProducts.length > 0" class="products-container">
                    <div class="product-card" v-for="product in filteredProducts" :key="product.id">
                        <div class="product-image">
                            <img :src="product.image" :alt="product.name" @error="handleImageError">
                        </div>
                        <div class="product-rating">
                            <div class="stars">
                                <i class="fas fa-star" v-for="star in 5" :key="star"></i>
                            </div>
                            <span class="rating-text">({{ product.reviews }})</span>     
                        </div>
                        <h4>{{ product.name }}</h4>
                        <p class="product-type">{{ product.type }}</p>
                        <div class="product-footer">
                            <span class="price">R{{ product.price.toFixed(2) }}</span>
                            <button class="add-cart-btn" @click="addToCart(product)">Add to Cart</button>
                        </div>
                    </div>
                </div>
                
                <!-- Display a message if no products are found after loading -->
                <div v-else class="no-results">
                    <p>No cakes found matching your search criteria.</p>
                    <p>Try adjusting your filters or search term.</p>
                </div>
            </section>
        </main>
    </div>
    <FootComp />
</template>

<script>
import FootComp from '@/components/FootComp.vue';
import NavbarComp from '@/components/NavbarComp.vue';
import NavComp from '@/components/NavComp.vue';
import { mapState } from 'vuex';

export default {
    name: 'PetTreatsView',
    components: {
        NavComp,
        NavbarComp,
        FootComp
    },
    data() {
        return {
            selectedCategory: '',
            priceFilters: [],
            showCart: false,
            cartItems: [],
            // ADDED: A loading state to handle asynchronous data fetching
            isLoading: true,
        };
    },
    created() {
        // Dispatch the action and handle the promise to update the loading state
        this.$store.dispatch('fetchProducts')
            .then(() => {
                this.isLoading = false;
            })
            .catch(error => {
                console.error("Failed to fetch products:", error);
                this.isLoading = false;
            });
    },
    computed: {
        ...mapState(['products', 'searchTerm']), // Added searchTerm to mapState

        filteredProducts() {
            // Check if products exist before filtering
            if (!this.products) {
                return [];
            }

            let filtered = this.products;

            // Filter by search term from the Vuex store
            if (this.searchTerm) {
                const searchLower = this.searchTerm.toLowerCase();
                filtered = filtered.filter(product => 
                    product.name.toLowerCase().includes(searchLower) ||
                    product.type.toLowerCase().includes(searchLower)
                );
            }

            // Filter by category
            if (this.selectedCategory) {
                filtered = filtered.filter(product => product.type === this.selectedCategory);
            }

            // Filter by price ranges
            if (this.priceFilters.length > 0) {
                filtered = filtered.filter(product => {
                    return this.priceFilters.some(range => {
                        if (range === 'under300') return product.price < 300;
                        if (range === '300to650') return product.price >= 300 && product.price <= 650;
                        if (range === 'over650') return product.price > 650;
                        return false;
                    });
                });
            }

            return filtered;
        },
        cartCount() {
            return this.cartItems.reduce((total, item) => total + item.quantity, 0);
        },
        cartTotal() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
    },
    methods: {
        goToCart() {
            this.$router.push({ name: 'CartView' });
        },
        // The search logic is now in the NavComp, this is not needed here
        // performSearch() {
        //     this.searchTerm = this.searchInput.trim();
        // },
        filterByCategory(category) {
            this.selectedCategory = this.selectedCategory === category ? '' : category;
            this.$store.commit('clearSearchTerm'); // Clear search term when filtering by category
        },
        showAllProducts() {
            this.selectedCategory = '';
            this.$store.commit('clearSearchTerm');
            this.priceFilters = [];
        },
        clearSearch() {
            this.$store.commit('clearSearchTerm');
        },
        addToCart(product) {
            const existingItem = this.cartItems.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cartItems.push({
                    ...product,
                    quantity: 1
                });
            }
            // Optionally show feedback (toast, etc.)
            this.showAddedToCartFeedback(product.name);
        },
        removeFromCart(productId) {
            const index = this.cartItems.findIndex(item => item.id === productId);
            if (index > -1) {
                this.cartItems.splice(index, 1);
            }
        },
        increaseQuantity(productId) {
            const item = this.cartItems.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity(productId) {
            const item = this.cartItems.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else if (item && item.quantity === 1) {
                this.removeFromCart(productId);
            }
        },
        toggleCart() {
            this.showCart = !this.showCart;
        },
        showAddedToCartFeedback(productName) {
            // You could add a toast notification here
            console.log(`Added ${productName} to cart!`);
        },
        handleImageError(event) {
            // Fallback to cake icon if image fails to load
            event.target.style.display = 'none';
            event.target.nextElementSibling?.remove(); // Remove any existing fallback
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = 'fas fa-birthday-cake fallback-icon';
            event.target.parentNode.appendChild(fallbackIcon);
        }
    },
    watch: {
        // Watch for changes in the search term from the store and reset other filters
        searchTerm(newTerm, oldTerm) {
            if (newTerm) {
                this.selectedCategory = '';
                this.priceFilters = [];
            }
        }
    }
}
</script>

<style scoped>
.modern-header {
    background-color: #f19bbd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 80;
        width: 100%;
        left: 0;
        right: auto;
        margin-left: 0;
        padding: 40px 0 0 0;
}

.header-content {
        width: 100%;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 60px;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: #e91e63;
  margin: 0;
  font-family: 'Dancing Script' , cursive;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.3s;
   font-size: 16px;
  position: relative;
  padding: 5px 0;
}

.nav-links a:hover {
  color: #d23c67;
  font-weight: 600;
}

.nav-links a.active {
  color: #d23c67;
  font-weight: 600;
}
.nav-links a.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e91e63;
}

.search-container {
    display: flex;
    align-items: center;
    border: 1px solid #f5e9e9;
    border-radius: 25px;
    padding: 8px 15px;
    width: 200px;
    background: #fff;
    transition: all 0.3s;
}
.search-container:focus-within {
  border-color: #e91e63;
  box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
}
.search-container input {
  border: none;
  outline: none;
  width: 100%;
  padding: 5px;
  font-size: 14px;
}

.search-container button {
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  transition: color 0.3s;
}

.user-icon {
  color: #555;
  cursor: pointer;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .search-container {
    width: 200px;
  }
}
.pet-treats-view {
    font-family: 'Poppins', sans-serif;
    background: #fff5f7; /* Very light pink background */
    min-height: 100vh;
}

/* .header { */
    /* display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(197, 137, 146, 0.9); /* Light pink header */
    /* padding: 1rem 2rem;
    min-height: 30px;
    position: relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
} */ 
.header-background {
  /* background-image: url('https://ohmycake.co.za/wp-content/uploads/2025/05/All-Cakes-Banner-Desktop_1920x600px.webp');
  background-size: cover; */
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 300px; /* Adjust as needed */
  position: relative;
  padding: 30px 0;
}

.logo {
    
    padding: 0.8rem 1.5rem;
    border-radius: 15px;
    color: #181617; /* Dark pink text */
    font-weight: bold;
    font-size: 1.2rem;
    letter-spacing: 1px;
}

.search-container {
    position: relative;
    flex: 1;
    max-width: 500px;
    margin: 0 2rem;
}

.search-input {
    width: 100%;
    padding: 12px 55px 12px 20px;
    border-radius: 25px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
}

.search-input:focus {
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3); /* Hot pink shadow */
}

.search-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #d23c67; /* Dark pink */
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 10;
}

.search-icon:hover {
    color: #ff1493; /* Deep pink */
}

.header-actions {
    display: flex;
    gap: 1rem;
    font-size: 1.3rem;
    color: white;
}

.cart-container {
    position: relative;
    width: 45px;
    height: 45px;
    background: rgba(210, 34, 34, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cart-container:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff6b8b; /* Coral pink */
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

.cart-dropdown {
    position: absolute;
    top: 100%;
    right: 2rem;
    width: 400px;
    max-height: 500px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(210, 60, 103, 0.2); /* Pink shadow */
    z-index: 1000;
    overflow: hidden;
    border: 1px solid #ffc0cb; /* Light pink border */
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #ffe5ec; /* Very light pink */
    background: #fff0f5; /* Lavender blush */
}

.cart-header h3 {
    margin: 0;
    color: #d23c67; /* Dark pink */
    font-size: 1.3rem;
}

.hero-section {
    padding: 4rem 2rem;
    text-align: center;
    
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.7);
    
    padding: 3rem;
    border-radius: 30px;
    box-shadow: 0 10px 30px rgba(210, 60, 103, 0.1);
    border: 1px solid #ffc0cb;
}
.hero-content:hover {
    background: #eaa1b6; /* Dark pink */
    transform: translateY(-2px);
}
.hero-content h1 {
    font-size: 2.5rem;
    color: #d23c67; /* Dark pink */
    margin-bottom: 1rem;
    font-weight: bold;
}

.hero-content p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.shop-button {
    background: #ff6b8b; /* Coral pink */
    color: white;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(255, 107, 139, 0.3);
}

.shop-button:hover {
    background: #d23c67; /* Dark pink */
    transform: translateY(-2px);
}

.main-layout {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.sidebar {
    background: white;
    padding: 1.5rem;
    width: 280px;
    border-radius: 20px;
    height: fit-content;
    box-shadow: 0 5px 15px rgba(210, 60, 103, 0.1);
    border: 1px solid #ffe5ec;
}

.sidebar h3 {
    color: #d23c67; /* Dark pink */
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
}

.category-list {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
}

.category-list li {
    margin-bottom: 0.8rem;
}

.category-list a {
    color: #666;
    text-decoration: none;
    padding: 10px 15px;
    display: block;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.category-list a:hover {
    background: #fff0f5; /* Lavender blush */
    color: #d23c67; /* Dark pink */
}

.price-filter h4 {
    color: #d23c67; /* Dark pink */
    margin-bottom: 1rem;
    font-weight: 600;
}

.price-filter label {
    display: block;
    color: #666;
    margin-bottom: 0.8rem;
    cursor: pointer;
}

.product-grid {
    flex: 1;
}

.grid-header {
    margin-bottom: 2rem;
}

.grid-header h2 {
    color: #d23c67; /* Dark pink */
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.grid-header p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.products-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #ffe5ec;
    box-shadow: 0 5px 15px rgba(210, 60, 103, 0.1);
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(210, 60, 103, 0.2);
    border-color: #ffc0cb;
}

.product-image {
    position: relative;
    background: #fff0f5; /* Lavender blush */
    border-radius: 15px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    transition: transform 0.3s ease;
}

.product-card h4 {
    color: #d23c67; /* Dark pink */
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.product-type {
    color: #888;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.price {
    color: #ff6b8b; /* Coral pink */
    font-size: 1.4rem;
    font-weight: bold;
}

.add-cart-btn {
    background: #ff6b8b; /* Coral pink */
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.add-cart-btn:hover {
    background: #d23c67; /* Dark pink */
}

/* Cart item styling */
.cart-item {
    border-bottom: 1px solid #ffe5ec;
    padding: 1rem 0;
}

.cart-item:last-child {
    border-bottom: none;
}

.remove-btn {
    background: #ff6b8b; /* Coral pink */
    color: white;
}

.checkout-btn {
    background: #ff6b8b; /* Coral pink */
    color: white;
}

.checkout-btn:hover {
    background: #d23c67; /* Dark pink */
}

/* Responsive Design */
@media (max-width: 768px) {
    .main-layout {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
    }
    
    .products-container {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}
</style>
