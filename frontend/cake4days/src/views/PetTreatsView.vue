<template>
    <div class="pet-treats-view">
        <header class="header">
            <div class="logo">PetTreats</div>
            <div class="search-container">
                <input 
                    type="text" 
                    placeholder="Search for cakes..." 
                    class="search-input"
                    v-model="searchTerm"
                    @keyup.enter="performSearch"
                />
                <i class="fas fa-search search-icon" @click="performSearch"></i>
            </div>
            <div class="header-actions">
                <div class="cart-container" @click="toggleCart">
                    <i class="fas fa-shopping-cart"></i>
                    <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
                </div>
                <i class="fas fa-user"></i>
            </div>
        </header>
        
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
        
        <section class="hero-section">
            <div class="hero-content">
                <h1>Delicious Cakes For Your Furry Friends</h1>
                <p>Premium quality pet cakes made with natural ingredients your pets will love</p>
                <button class="shop-button">Shop Now</button>
            </div>
        </section>
        
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
                    <label><input type="checkbox" v-model="priceFilters" value="under15">Under $15</label>
                    <label><input type="checkbox" v-model="priceFilters" value="15to25">$15 - $25</label>
                    <label><input type="checkbox" v-model="priceFilters" value="over25">Over $25</label>
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
                            <i class="fas fa-birthday-cake"></i>
                            <button class="favorite-btn">
                                <i class="fas fa-heart"></i>
                            </button>
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
                            <span class="price">${{ product.price.toFixed(2) }}</span>
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
            selectedCategory: '',
            priceFilters: [],
            showCart: false,
            cartItems: [],
            products: [
                { id: 1, name: 'Birthday Bone Cake', type: 'Dog Cakes', price: 24.99, reviews: 34 },
                { id: 2, name: 'Peanut Butter Pupcake', type: 'Dog Cakes', price: 18.50, reviews: 28 },
                { id: 3, name: 'Tuna Celebration Cake', type: 'Cat Cakes', price: 22.75, reviews: 41 },
                { id: 4, name: 'Carrot & Honey Dog Cake', type: 'Dog Cakes', price: 19.99, reviews: 52 },
                { id: 5, name: 'Millet Seed Cake', type: 'Bird Cakes', price: 12.99, reviews: 19 },
                { id: 6, name: 'Bacon Birthday Cake', type: 'Dog Cakes', price: 26.50, reviews: 38 },
                { id: 7, name: 'Salmon Kitty Cake', type: 'Cat Cakes', price: 21.99, reviews: 33 },
                { id: 8, name: 'Sweet Potato Celebration', type: 'Dog Cakes', price: 23.99, reviews: 45 },
                { id: 9, name: 'Chicken Training Cake', type: 'Training Cakes', price: 20.50, reviews: 26 },
                { id: 10, name: 'Apple Cinnamon Pup Cake', type: 'Dog Cakes', price: 17.75, reviews: 39 },
                { id: 11, name: 'Catnip Dream Cake', type: 'Cat Cakes', price: 19.25, reviews: 31 },
                { id: 12, name: 'Fruit & Nut Bird Cake', type: 'Bird Cakes', price: 14.50, reviews: 22 },
                { id: 13, name: 'Liver & Cheese Cake', type: 'Dog Cakes', price: 28.99, reviews: 48 },
                { id: 14, name: 'Mini Training Cupcakes', type: 'Training Cakes', price: 15.50, reviews: 35 },
                { id: 15, name: 'Mackerel Party Cake', type: 'Cat Cakes', price: 25.75, reviews: 44 },
                { id: 16, name: 'Pumpkin Spice Pup Cake', type: 'Dog Cakes', price: 21.25, reviews: 42 },
                { id: 17, name: 'Vanilla Birthday Cake', type: 'Dog Cakes', price: 24.00, reviews: 37 },
                { id: 18, name: 'Fish Fiesta Cake', type: 'Cat Cakes', price: 23.50, reviews: 29 },
                { id: 19, name: 'Coconut Bird Cake', type: 'Bird Cakes', price: 11.99, reviews: 18 },
                { id: 20, name: 'Beef & Veggie Cake', type: 'Dog Cakes', price: 27.50, reviews: 51 }
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
                        if (range === 'under15') return product.price < 15;
                        if (range === '15to25') return product.price >= 15 && product.price <= 25;
                        if (range === 'over25') return product.price > 25;
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
        performSearch() {
            console.log('Searching for:', this.searchTerm);
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
            
            // Show a brief confirmation
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
        }
    }
};
</script>

<style scoped>
.pet-treats-view {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #e88d4d 0%, #A0522D 50%, #CD853F 100%);
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    padding: 1rem 2rem;
    min-height: 70px;
    position: relative;
}

.logo {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.8rem 1.5rem;
    border-radius: 15px;
    color: white;
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
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.5);
}

.search-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 10;
}

.search-icon:hover {
    color: #333;
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
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cart-container:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #FF4444;
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

.header-actions i {
    width: 45px;
    height: 45px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.header-actions i:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
}

.cart-dropdown {
    position: absolute;
    top: 100%;
    right: 2rem;
    width: 400px;
    max-height: 500px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cart-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.3rem;
}

.close-cart {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-cart:hover {
    color: #333;
}

.cart-content {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
}

.empty-cart {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-info h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1rem;
}

.cart-item-type {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
}

.cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-btn {
    background: #FFC107;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
    color: #333;
}

.quantity {
    min-width: 20px;
    text-align: center;
    font-weight: bold;
    color: #333;
}

.cart-item-price {
    text-align: right;
}

.cart-item-price span {
    display: block;
    font-weight: bold;
    color: #FFC107;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.remove-btn {
    background: #FF4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    cursor: pointer;
}

.cart-total {
    text-align: center;
    padding: 1rem;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #333;
}

.checkout-btn {
    width: 100%;
    background: #FFC107;
    color: #333;
    border: none;
    padding: 1rem;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
}

.checkout-btn:hover {
    background: #FFB300;
    transform: translateY(-2px);
}

.hero-section {
    padding: 4rem 2rem;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    padding: 3rem;
    border-radius: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.hero-content h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
    font-weight: bold;
}

.hero-content p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.shop-button {
    background: #FFC107;
    color: #333;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.shop-button:hover {
    background: #FFB300;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4);
}

.main-layout {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.sidebar {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    padding: 1.5rem;
    width: 280px;
    border-radius: 20px;
    height: fit-content;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
    color: white;
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
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 10px 15px;
    display: block;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.category-list a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.price-filter h4 {
    color: white;
    margin-bottom: 1rem;
    font-weight: 600;
}

.price-filter label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.8rem;
    cursor: pointer;
}

.price-filter input {
    margin-right: 0.8rem;
}

.product-grid {
    flex: 1;
}

.grid-header {
    margin-bottom: 2rem;
}

.grid-header h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.grid-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.search-info {
    margin-top: 1rem;
}

.search-info p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.clear-search {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.clear-search:hover {
    background: rgba(255, 255, 255, 0.3);
}

.products-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

.product-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.product-image {
    position: relative;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    overflow: hidden;
}

.product-image i.fa-birthday-cake {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.6);
}

.favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.favorite-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
}

.product-rating {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    gap: 0.5rem;
}

.stars {
    display: flex;
    gap: 2px;
}

.stars i {
    color: #FFC107;
    font-size: 0.9rem;
}

.stars .far {
    color: rgba(255, 255, 255, 0.3);
}

.rating-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.product-card h4 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.product-type {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    color: #FFC107;
    font-size: 1.4rem;
    font-weight: bold;
}

.add-cart-btn {
    background: #FFC107;
    color: #333;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.add-cart-btn:hover {
    background: #FFB300;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
}

.no-results {
    text-align: center;
    padding: 4rem 2rem;
}

.no-results p {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.no-results p:last-child {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .main-layout {
        flex-direction: column;
        padding: 1rem;
    }
    
    .sidebar {
        width: 100%;
    }
    
    .products-container {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .search-container {
        margin: 0 1rem;
        max-width: none;
        flex: 1;
    }
    
    .header {
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .header-actions {
        order: 3;
    }
    
    .cart-dropdown {
        right: 1rem;
        width: calc(100vw - 2rem);
        max-width: 400px;
    }
}
</style>