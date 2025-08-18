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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
          <div class="header-icons">
            <div class="icon user-icon" title="Account" @click="HandleProfileClick"
              style="cursor: pointer;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <button>
              <div @click="toggleCart" class="icon cart-icon" title="Shopping Cart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
// No need to import other components here
import { mapGetters } from 'vuex';
import { useCartStore } from '@/store/cart';

export default {
  name: 'NavComp', // Changed to a unique, descriptive name
  data() {
    return {
      searchQuery: '',
      headerBackgroundImage: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=1200&h=400&fit=crop',
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
    profileDetails() {
      return this.user;
    },
    totalItems() {
      const cartStore = useCartStore();
      return cartStore.totalItems;
    },
    
  },
  methods: {
    toggleCart() {
      const cartStore = useCartStore();
      cartStore.toggleCart();
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: 'catalogue', query: { q: this.searchQuery } });
      }
    },
    getHeaderBackground() {
      if (!this.headerBackgroundImage) {
        return 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #CD853F 100%)';
      }
      return `linear-gradient(rgba(139, 90, 60, 0.85), rgba(160, 82, 45, 0.85)), url('${this.headerBackgroundImage}')`;
    },
    HandleProfileClick() {
      if (this.isLoggedIn) {
        // Since ProfileModal is now in the parent, emit an event to tell the parent to show it.
        this.$emit('show-profile-modal');
      } else {
        this.$router.push({ name: 'sign' });
      }
    },
  },
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.container-fluid {
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  position: relative;
  z-index: 2;
}

.logo {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -1px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.logo-tagline {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar {
  padding: 12px 50px 12px 20px;
  border-radius: 50px;
  border: none;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  color: #4B2E2B;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-bar::placeholder {
  color: #999;
  font-style: italic;
}

.search-btn {
  position: absolute;
  right: 5px;
  background: #8B5A3C;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #A0522D;
  transform: scale(1.1);
}

.header-icons {
  display: flex;
  gap: 15px;
}

.icon {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .top-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .search-bar {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 24px;
  }

  .search-bar {
    width: 200px;
  }
}
</style>