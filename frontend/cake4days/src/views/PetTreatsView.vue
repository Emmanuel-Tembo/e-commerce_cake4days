<template>
    <NavComp />
    <NavbarComp />
    <div class="container-fluid">
        <div class="background-section" :style="{
            backgroundImage: 'url(https://www.cakesforpets.fr/cdn/shop/files/AA.jpg?v=1745007535&width=3840)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '70px 0'

        }">
            <section class="hero-section">
                <div class="hero-content">
                    <h1>Delicious Cakes For Your Furry Friends</h1>
                    <p>Premium quality pet cakes made with natural ingredients your pets will love</p>
                </div>
            </section>
        </div>

        <main class="main-layout">
            <aside class="sidebar">
                <h3>categories</h3>
                <ul class="category-list">
                    <li><a href="#" @click.prevent="filterByCategory('Dog Cakes')">Dog Cakes</a></li>
                    <li><a href="#" @click.prevent="filterByCategory('Cat Cakes')">Cat Cakes</a></li>
                    <!-- <li><a href="#" @click.prevent="filterByCategory('Bird Cakes')">Bird Cakes</a></li> -->
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
                    <div class="product-card" v-for="product in filteredProducts" :key="product.product_id"
                        @click="viewCakeDetail(product.product_id)">
                        <div class="product-image">
                            <img :src="product.image_url" :alt="product.name" @error="handleImageError">
                        </div>
                        <div class="product-rating">
                            <div class="stars">
                                <i class="fas fa-star" v-for="star in 5" :key="star"></i>
                            </div>
                            <span class="rating-text">({{ product.total_reviews }})</span>
                        </div>
                        <h4>{{ product.name }}</h4>
                        <p class="product-type">{{ product.type }}</p>
                        <div class="product-footer">
                            <span class="price">R{{ product.price.toFixed(2) }}</span>
                            
                        </div>
                    </div>
                </div>

                <div class="quick-view-modal" v-if="selectedTreat" @click.self="closeModal">
    <div class="modal-content">
        <button class="close-modal" @click="closeModal">
            <i class="fas fa-times"></i>
        </button>
        <div class="modal-body">
            <div class="modal-image">
                <img :src="selectedTreat.image_url" :alt="selectedTreat.name">
            </div>
            <div class="modal-details">
                <h2>{{ selectedTreat.name }}</h2>
                <p class="modal-description">{{ selectedTreat.description }}</p>

                <div class="modal-meta">
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>{{ selectedTreat.category }}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user-friends"></i>
                        <span v-if="selectedTreat.serves !== null">Serves {{ selectedTreat.serves }}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span v-if="selectedTreat.preparation_time !== null">{{ selectedTreat.preparation_time }}</span>
                    </div>
                </div>

                <div class="price-section">
                    <span class="modal-price">R{{ selectedTreat.price.toFixed(2) }}</span>
                    <button class="add-cart-btn" @click="addToCart(selectedTreat)">Add to Cart</button>
                </div>

                <div class="allergens" v-if="selectedTreat.allergens !== null">
                    <h4>Allergens:</h4>
                    <p>{{ selectedTreat.allergens }}</p>
                </div>
            </div>
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
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'PetTreatsView',
    components: {
        NavComp,
        NavbarComp,
        FootComp
    },
    setup() {
        const cartStore = useCartStore();

        // Use storeToRefs to get reactive references to state properties
        const { cartItems, totalItems, subtotal, isCartOpen } = storeToRefs(cartStore);

        // Get ALL actions directly from the store
        const { toggleCart, removeFromCart, increaseQuantity, decreaseQuantity, addToCart } = cartStore;


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
            cartStore,
            addToCart,
        };
    },

    data() {
        return {
            selectedCategory: '',
            priceFilters: [],
            selectedTreat: null,
            showCart: false,
            isLoading: true,
        };
    },
    created() {
        // Dispatch the action and handle the promise to update the loading state
        this.fetchPetProducts()
            .then(() => {
                this.isLoading = false;
            })
            .catch(error => {
                console.error("Failed to fetch products:", error);
                this.isLoading = false;
            });
    },
    computed: {
        ...mapState(['petProducts', 'searchTerm']), // Added searchTerm to mapState

        filteredProducts() {
            // Check if products exist before filtering
            if (!this.petProducts) {
                return [];
            }

            let filtered = this.petProducts;

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
                filtered = filtered.filter(fetchPetProducts => fetchPetProducts.type === this.selectedCategory);
            }

            // Filter by price ranges
            if (this.priceFilters.length > 0) {
                filtered = filtered.filter(fetchPetProducts => {
                    return this.priceFilters.some(range => {
                        if (range === 'under300') return fetchPetProducts.price < 300;
                        if (range === '300to650') return fetchPetProducts.price >= 300 && fetchPetProducts.price <= 650;
                        if (range === 'over650') return fetchPetProducts.price > 650;
                        return false;
                    });
                });
            }

            return filtered;
        },
    },
    methods: {
        ...mapActions(['fetchPetProducts']),
        goToCart() {
            this.$router.push({ name: 'CartView' });
        },
        viewCakeDetail(productId) {
              // Find the product from the filteredProducts array using the product's 'id' property.
    // The `productId` parameter is what is passed from the v-for loop.
    this.selectedTreat = this.filteredProducts.find(product => product.product_id === productId);
    // You can add console.log to confirm the product is being found
    console.log('Product selected:', this.selectedTreat);
        },
        closeModal() {
            this.selectedTreat = null;
        },
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
            this.cartStore.addToCart(product);
            this.closeModal();
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
/* Main Page Layout */
.container-fluid {
  font-family: 'Poppins', sans-serif;
  background-color: #f7f3f0; /* Soft, light background */
  padding-top: 60px; /* Add padding for sticky header */
}

/* Background & Hero Section */
.background-section {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 100px 0;
}

.background-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Dark overlay */
}

.hero-section {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-content {
  color: white;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

.shop-button {
  background: #f19bbd;
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.shop-button:hover {
  background: #e91e63;
  transform: translateY(-2px);
}

/* Main Layout (Sidebar + Grid) */
.main-layout {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
}

.sidebar {
  background-color: #fff;
  padding: 1.5rem; /* Slightly reduced padding */
  width: 200px; /* Reduced width */
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  position: sticky;
  top: 80px; /* Adjust top spacing for header */
  height: fit-content;
}

.sidebar h3 {
  font-size: 1.2rem; /* Slightly smaller heading */
  font-weight: 600;
  color: #d23c67;
  text-transform: capitalize;
  margin-bottom: 1rem; /* Slightly reduced margin */
}

.category-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem; /* Slightly reduced margin */
}

.category-list li a {
  display: block;
  padding: 8px 10px; /* Smaller padding */
  color: #555;
  text-decoration: none;
  border-radius: 6px; /* Smaller border-radius */
  transition: background-color 0.3s;
  font-size: 0.9rem; /* Slightly smaller font */
}

.category-list li a:hover {
  background-color: #fce2e8;
  color: #d23c67;
}

.price-filter h4 {
  font-size: 1rem; /* Smaller heading */
  font-weight: 600;
  color: #d23c67;
  margin-bottom: 0.8rem; /* Slightly reduced margin */
}

.price-filter label {
  display: flex;
  align-items: center;
  gap: 8px; /* Smaller gap */
  margin-bottom: 8px; /* Smaller margin */
  color: #555;
  cursor: pointer;
  font-size: 0.85rem; /* Slightly smaller font */
}

/* Product Grid */
.product-grid {
  flex: 1;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.grid-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #d23c67;
  margin: 0;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #f19bbd; /* Subtle pink outline */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(241, 155, 189, 0.7); /* Pink glow */
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
  background-color: #fce2e8;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 15px 0;
}

.product-rating .stars {
  color: #ffc107; /* Yellow for stars */
}

.product-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
}

.product-type {
  font-size: 0.9rem;
  color: #777;
  text-align: center;
}

.product-footer {
  text-align: center;
  padding: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e91e63;
}

/* Empty State and Loading */
.loading-message, .no-results {
  text-align: center;
  padding: 50px 0;
}

.no-results p {
  font-size: 1.2rem;
  color: #777;
}

/* Quick View Modal */
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
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
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
  color: #d23c67;
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
  color: #f19bbd;
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
  color: #e91e63;
}

.add-cart-btn {
  background-color: #f19bbd;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-cart-btn:hover {
  background-color: #d23c67;
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
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static; /* Revert to static for smaller screens */
    margin-bottom: 20px;
  }

  .products-container {
    grid-template-columns: 1fr;
  }

  .grid-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>