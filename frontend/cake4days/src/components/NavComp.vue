<template>
    <div class="cake-website">
        <div class="container-fluid" :style="{ backgroundImage: getHeaderBackground() }">
            <header class="top-header">
                <div class="logo">
                    <h1 class="logo-text">CAKE FOR DAYS</h1>
                    <p class="logo-tagline">Cakes & Pet Treats</p>
                </div>
                <div class="header-actions">
                    <div class="search-container">
                        <input type="text" class="search-bar" placeholder="Search cakes, pet treats & more..."
                            v-model="searchQuery" @keyup.enter="handleSearch" />
                        <button class="search-btn" @click="handleSearch">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="header-icons">
                        <div class="icon user-icon" title="Account" @click="HandleProfileClick"
                            style="cursor: pointer;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <!-- v-if="isLoggedIn" use if code breaks -->
                        <ProfileModal :user-data="profileDetails" :is-visible="isModalVisible"
                            @close-modal="isModalVisible = false" />
                        <button>
                            <div @click="toggleCart" class="icon cart-icon" title="Shopping Cart">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="8" cy="21" r="1"></circle>
                                    <circle cx="19" cy="21" r="1"></circle>
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6">
                                    </path>
                                </svg>
                                <span v-if="totalItems > 0"
                                    class="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {{ totalItems }}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CakeForDaysWebsite',
    components: {
        Navbar,
        ProfileModal,
    },
    data() {
        return {
            searchQuery: '',
            isModalVisible: false,
            backgroundImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="cakes" patternUnits="userSpaceOnUse" width="80" height="80"><rect width="80" height="80" fill="%23F9D6D5" opacity="0.1"/><circle cx="20" cy="20" r="8" fill="%23CD853F" opacity="0.3"/><rect x="35" y="15" width="10" height="10" fill="%238B5A3C" opacity="0.3"/><circle cx="60" cy="25" r="6" fill="%23DEB887" opacity="0.4"/><rect x="15" y="45" width="8" height="15" fill="%23CD853F" opacity="0.3"/><circle cx="45" cy="55" r="5" fill="%238B5A3C" opacity="0.4"/><rect x="65" y="50" width="6" height="8" fill="%23DEB887" opacity="0.3"/></pattern></defs><rect width="100%25" height="100%25" fill="url(%23cakes)"/></svg>',
            headerBackgroundImage: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=1200&h=400&fit=crop',
        }
    },
    computed: {
        ...mapGetters(['isLoggedIn', 'user']), // Corrected 'isLoggedin' to 'isLoggedIn'
        profileDetails() {
            return this.user;
        },
        // Pinia Getter: Accessing the totalItems from the cart store
        totalItems() {
            const cartStore = useCartStore();
            return cartStore.totalItems;
        },
    },
    methods: {
        // Pinia Action: Calling the toggleCart action from the store
        toggleCart() {
            const cartStore = useCartStore();
            cartStore.toggleCart();
        },
        handleSearch() {
            if (this.searchQuery.trim()) {
                console.log('Searching for:', this.searchQuery);
                this.$router.push({ name: 'catalogue', query: { q: this.searchQuery } });
            }
        },
        viewProducts() {
            console.log('Viewing all products...');
            this.$router.push('/catalogue');
        },
        viewCategory(category) {
            if (category === 'human') {
                this.$router.push({ name: 'catalogue', query: { category: 'human' } });
            } else if (category === 'pet') {
                this.$router.push({ name: 'PetTreats', query: { category: 'pet' } });
            }
        },
        getHeroBackground() {
            if (!this.backgroundImage) {
                return 'linear-gradient(rgba(249, 214, 213, 0.9), rgba(240, 197, 196, 0.9))';
            }
            return `linear-gradient(rgba(249, 214, 213, 0.9), rgba(240, 197, 196, 0.9)), url('${this.backgroundImage}')`;
        },
        getHeaderBackground() {
            if (!this.headerBackgroundImage) {
                return 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #CD853F 100%)';
            }
            return `linear-gradient(rgba(139, 90, 60, 0.85), rgba(160, 82, 45, 0.85)), url('${this.headerBackgroundImage}')`;
        },
        HandleProfileClick() {
            if (this.isLoggedIn) {
                this.isModalVisible = true;
            } else {
                this.$router.push({ name: 'sign' });
            }
        },
    },
};
</script>