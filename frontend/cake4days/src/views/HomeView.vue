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
            <input 
              type="text" 
              class="search-bar" 
              placeholder="Search cakes, pet treats & more..." 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
          <div class="header-icons">
            <router-link to="/sign">
            <div class="icon user-icon" title="Account" @click="goToSignup" style="cursor: pointer;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            </router-link>
            <div class="icon cart-icon" title="Shopping Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6"></path>
              </svg>
            </div>
          </div>
        </div>
      </header>


    </div>
  
    <Navbar /> 

    <section class="hero" :style="{ backgroundImage: getHeroBackground() }">
      <div class="hero-background">
        <div class="hero-side hero-left">
          <!-- <img src="@/assets/cake.png" alt="cake"/> -->
          
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-box">
          <h2 class="hero-title">
            Sweet Treats For <span class="highlight">Everyone</span><br>
            You & Your Pets
          </h2>
          <p class="hero-subtitle">
            From birthday cakes to puppy cupcakes - we've got delicious treats 
            for the whole family. Premium ingredients, made fresh daily.
          </p>
          <!-- <div class="hero-side hero-right">
      <img src="@/assets/cookies.png" alt="Cookies" />
      <div class="tag tag-right">Freshly Baked</div>
    </div> -->
          <button class="cta" @click="viewProducts">
            <span>Shop All Treats</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
          
          <!-- Quick Category Buttons -->
          <div class="category-buttons">
            <button class="category-btn human" @click="viewCategory('human')">
              <span>🎂</span>
              Human Cakes
            </button>
            <button class="category-btn pet" @click="viewCategory('pet')">
              <span>🐕</span>
              Pet Treats
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from '../components/NavbarComp.vue';

export default {
  name: 'CakeForDaysWebsite',
  components: {
    Navbar
  },
  data() {
    return {
      searchQuery: '',

      backgroundImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="cakes" patternUnits="userSpaceOnUse" width="80" height="80"><rect width="80" height="80" fill="%23F9D6D5" opacity="0.1"/><circle cx="20" cy="20" r="8" fill="%23CD853F" opacity="0.3"/><rect x="35" y="15" width="10" height="10" fill="%238B5A3C" opacity="0.3"/><circle cx="60" cy="25" r="6" fill="%23DEB887" opacity="0.4"/><rect x="15" y="45" width="8" height="15" fill="%23CD853F" opacity="0.3"/><circle cx="45" cy="55" r="5" fill="%238B5A3C" opacity="0.4"/><rect x="65" y="50" width="6" height="8" fill="%23DEB887" opacity="0.3"/></pattern></defs><rect width="100%25" height="100%25" fill="url(%23cakes)"/></svg>',
      // Header background (can be different from hero)
      // headerBackgroundImage: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&h=400&fit=crop',
      // Alternative header background options (uncomment any one to use):
      // headerBackgroundImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=400&fit=crop', 
      headerBackgroundImage: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=1200&h=400&fit=crop', 
      // headerBackgroundImage: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=400&fit=crop',
      // headerBackgroundImage: '', // No header background image
      
      // Alternative background options for hero section:
      // backgroundImage: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=600&fit=crop',
      // backgroundImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', 
      // backgroundImage: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&h=600&fit=crop', 
      // backgroundImage: '', // No background image (just gradients)
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        console.log('Searching for:', this.searchQuery);
        
      }
    },
    navigate(section) {
      console.log('Navigating to:', section);
      
    },
    viewProducts() {
      console.log('Viewing all products...');
      
    //   if(category === 'human'){
    //     this.$router.push('/catalogue');
    //   }else if (category === 'pet'){
    //     this.$router.push('/pet-treats');
    //   }
  },
    viewHumanCakes() {
      console.log(`Viewing Human cakes...`);
      this.$router.push('/catalogue');
    },
    viewPetTreats(){
      console.log('Viewing pet treats...');
      this,this.$router.push('/pet-treats');
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
    goToSignup() {
      console.log('Account icon clicked - redirecting to signup...');
    this.$router.push('/sign');
    }
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.cake-website {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #FAF0E6 0%, #F5E6D3 100%);
}

.container {
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transform: rotate(-15deg);
  pointer-events: none;
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



.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  min-height: 60vh;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(205, 133, 63, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(222, 184, 135, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 90, 60, 0.1) 0%, transparent 30%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  width: 100%;
}

.hero-box {
  background: linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #CD853F 100%);
  color: white;
  padding: 60px 50px;
  border-radius: 30px;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.15),
    0 10px 30px rgba(139, 90, 60, 0.3);
  position: relative;
  overflow: hidden;
  border: 3px solid rgba(249, 214, 213, 0.3);
}

.hero-box::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
}

.highlight {
  color: #F9D6D5;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 35px;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
}

.cta {
  margin-top: 20px;
  background: linear-gradient(135deg, #DEB887 0%, #CD853F 100%);
  color: #4A4A4A;
  padding: 18px 40px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 15px 40px rgba(222, 184, 135, 0.4);
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cta:hover::before {
  left: 100%;
}

.cta:hover {
  background: linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 25px 60px rgba(222, 184, 135, 0.5);
}

.cta svg {
  transition: transform 0.3s ease;
}

.cta:hover svg {
  transform: translateX(5px);
}

.category-buttons {
  display: flex;
  gap: 20px;
  margin-top: 25px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 15px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
}

.category-btn span {
  font-size: 18px;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.category-btn.human:hover {
  background: rgba(222, 184, 135, 0.3);
  border-color: #DEB887;
}

.category-btn.pet:hover {
  background: rgba(205, 133, 63, 0.3);
  border-color: #CD853F;
}

/* Responsive Design */
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

  .category-buttons {
    gap: 15px;
  }

  .category-btn {
    font-size: 12px;
    padding: 12px 20px;
    min-width: 120px;
  }

  .hero {
    padding: 40px 20px;
  }

  .hero-box {
    padding: 40px 30px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .cta {
    padding: 15px 30px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 24px;
  }

  .search-bar {
    width: 200px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-box {
    padding: 30px 20px;
  }
}
</style>