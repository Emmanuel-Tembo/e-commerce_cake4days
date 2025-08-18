<template>
    <div class="container-fluid">
        <header class="modern-header">
            <div class="header-content">
                <div class="logo">
                    <h1 class="logo-text">CAKE FOR DAYS</h1>
                    <h2 class="logo-tagline">Pet Treats</h2>
                </div>
                <div class="header-actions">
                    <div class="search-container">
                        <input
                            type="text"
                            class="search-bar"
                            placeholder="Search Cakes..."
                            v-model="searchInput"
                            @keyup.enter="performSearch"
                        />
                        <button class="search-btn" @click="performSearch">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                    </div>
                                <div class="header-icons" style="display: flex; gap: 10px; align-items: center;">
                                    <router-link to="/sign" class="icon-link">
                                        <div class="icon user-icon" title="Account">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                    </router-link>
                                    <div class="icon cart-icon" title="Shopping Cart" @click="goToCart">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="8" cy="21" r="1"></circle>
                                            <circle cx="19" cy="21" r="1"></circle>
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6"></path>
                                        </svg>
                                        <span v-if="cartItems.length > 0" class="cart-badge">{{ cartItems.length }}</span>
                                    </div>
                                </div>
                </div>
            </div>
        </header>
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
                    <p>Showing {{ filteredProducts.length }} cakes</p>
                    <div v-if="searchTerm" class="search-info">
                        <p>Search results for: "<strong>{{ searchTerm }}</strong>"</p>
                        <button @click="clearSearch" class="clear-search">Clear Search</button>
                    </div>
                </div>
                
                <div class="products-container">
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
                
                <div v-if="filteredProducts.length === 0" class="no-results">
                    <p>No cakes found matching your search criteria.</p>
                    <p>Try adjusting your filters or search term.</p>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: 'PetTreatsView',
    data() {
        return {
            searchTerm: '',
            searchInput: '',
            selectedCategory: '',
            priceFilters: [],
            showCart: false,
            cartItems: [],
            products: [
                { id: 1, name: 'Birthday Bone Cake', type: 'Dog Cakes', price: 300, reviews: 34, image: 'https://www.cakesforpets.fr/cdn/shop/files/GateauOSAnniversairebleuensemble.jpg?v=1740342583&width=360' },
                { id: 2, name: 'Peanut Butter Pupcake', type: 'Dog Cakes', price: 250, reviews: 28, image: 'https://i0.wp.com/still-busy-baking.ca/wp-content/uploads/2024/03/DSC02147-1024x684.jpg?ssl=1' },
                { id: 3, name: 'Tuna Celebration Cake', type: 'Cat Cakes', price: 350, reviews: 41, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3phTn8M5Qo6c3bJvHkwkE8N5HqL6dR_DQ0Q&s' },
                { id: 4, name: 'Carrot & Honey Dog Cake', type: 'Dog Cakes', price: 500, reviews: 52, image: 'https://www.obsessivecooking.com/wp-content/uploads/2023/05/carrot-banana-dog-fox-cake-2-1200.jpg' },
                { id: 5, name: 'Millet Seed Cake', type: 'Bird Cakes', price: 200, reviews: 19, image: 'data:image/jpeg;base64,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' },
                { id: 6, name: 'Bacon Birthday Cake', type: 'Dog Cakes', price: 250, reviews: 38, image: 'data:image/jpeg;base64,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' },
                { id: 7, name: 'Salmon Kitty Cake', type: 'Cat Cakes', price: 500, reviews: 33, image: 'https://www.allrecipes.com/thmb/Os1uL1-9PAkhAC8qXPksBUQEt6k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-265170-birthday-cake-for-your-cat-DDMFS-4x3-Beauty-6aa665121db148d0ae60b741551f8fe5.jpg' },
                { id: 8, name: 'Sweet Potato Celebration', type: 'Dog Cakes', price: 480, reviews: 45, image: 'https://www.cakesforpets.fr/cdn/shop/files/CakeetDonutsAnniversaireroseboite.jpg?v=1745331300&width=360' },
                { id: 9, name: 'Cat Training Cake', type: 'Training Cakes', price: 308, reviews: 26, image: 'https://www.cakesforpets.fr/cdn/shop/files/friandisepoissonsaumonbetterave.jpg?v=1744831815&width=360' },
                { id: 10, name: 'Apple Cinnamon Pup Cake', type: 'Dog Cakes', price: 220, reviews: 39, image: 'https://www.cakesforpets.fr/cdn/shop/files/friandisedemispherepouletcarotte.jpg?v=1744831742&width=360' },
                { id: 11, name: 'Catnip Dream Cake', type: 'Cat Cakes', price: 157, reviews: 31, image: 'https://www.cakesforpets.fr/cdn/shop/files/BonbonnieresFriandises3.jpg?v=1740343109&width=360' },
                { id: 12, name: 'Fruit & Nut Bird Cake', type: 'Bird Cakes', price: 567, reviews: 22, image: 'https://www.cakesforpets.fr/cdn/shop/files/Biscuitpommebananepourchien.jpg?v=1740589320&width=360' },
                { id: 13, name: 'Liver & Cheese Cake', type: 'Dog Cakes', price: 234, reviews: 48, image: 'https://www.cakesforpets.fr/cdn/shop/files/friandisemadelainesaumonbetterave.jpg?v=1740345692&width=360' },
                { id: 14, name: 'Mini Training Cupcakes', type: 'Training Cakes', price: 345, reviews: 35, image: 'https://example.com/mini-training-cupcakes.jpg' },
                { id: 15, name: 'Mackerel Party Cake', type: 'Cat Cakes', price: 187, reviews: 44, image: 'https://www.cakesforpets.fr/cdn/shop/files/rriandisegaufreboeufcourgette.jpg?v=1740345581&width=360' },
                { id: 16, name: 'Pumpkin Spice Pup Cake', type: 'Dog Cakes', price: 345, reviews: 42, image: 'https://www.cakesforpets.fr/cdn/shop/files/IMG_0868.jpg?v=1745321700&width=493' },
                { id: 17, name: 'Vanilla Birthday Cake', type: 'Dog Cakes', price: 250, reviews: 37, image: 'https://www.cakesforpets.fr/cdn/shop/files/IMG_0882.jpg?v=1744744091&width=493' },
                { id: 18, name: 'Fish Fiesta Cake', type: 'Cat Cakes', price: 200, reviews: 29, image: 'https://www.cakesforpets.fr/cdn/shop/files/pattechienrose.png?v=1742934678&width=493' },
                { id: 19, name: 'Coconut Bird Cake', type: 'Bird Cakes', price: 180, reviews: 18, image: 'https://www.cakesforpets.fr/cdn/shop/files/Boxe_Patisseries_Donuts_Patte_de_Chien_animal.jpg?v=1745872623&width=823' },
                { id: 20, name: 'Beef & Veggie Cake', type: 'Dog Cakes', price: 125, reviews: 51, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8fWgXGOGQGUOWfsgu7rxfNvw0QUUNfQmquNjZrsEvGoO5eyDB4kEzB2HB7r_SjxOcxRQ&usqp=CAU' }
            ]
        };
    },
    computed: {
        filteredProducts() {
            let filtered = this.products;

            // Filter by search term
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
                        if (range === '300to650') return product.price >= 300&& product.price <= 650;
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
        performSearch() {
            this.searchTerm = this.searchInput.trim();
        },
        filterByCategory(category) {
            this.selectedCategory = this.selectedCategory === category ? '' : category;
            this.searchTerm = '';
        },
        showAllProducts() {
            this.selectedCategory = '';
            this.searchTerm = '';
            this.priceFilters = [];
        },
        clearSearch() {
            this.searchTerm = '';
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