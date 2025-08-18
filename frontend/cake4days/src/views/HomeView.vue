<template>
  <NavComp />
  <Navbar />
  <section class="hero" :style="{ backgroundImage: getHeroBackground() }">
    <div class="hero-background">
      <div class="hero-side hero-left">
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
        <button class="cta" @click="viewProducts">
          <span>Shop All Treats</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>

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
</template>

<script>
import Navbar from '../components/NavbarComp.vue';
import ProfileModal from '@/components/ProfileModal.vue';
import { mapGetters } from 'vuex';
import { useCartStore } from '@/store/cart';
import NavComp from '@/components/NavComp.vue';

export default {
  name: 'CakeForDaysWebsite',
  components: {
    Navbar,
    ProfileModal,
    NavComp,
  },
  data() {
    return {
      // You don't use searchQuery or headerBackgroundImage in this component's template.
      // They are only used in NavComp, so they should be defined there.
      isModalVisible: false,
      backgroundImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="cakes" patternUnits="userSpaceOnUse" width="80" height="80"><rect width="80" height="80" fill="%23F9D6D5" opacity="0.1"/><circle cx="20" cy="20" r="8" fill="%23CD853F" opacity="0.3"/><rect x="35" y="15" width="10" height="10" fill="%238B5A3C" opacity="0.3"/><circle cx="60" cy="25" r="6" fill="%23DEB887" opacity="0.4"/><rect x="15" y="45" width="8" height="15" fill="%23CD853F" opacity="0.3"/><circle cx="45" cy="55" r="5" fill="%238B5A3C" opacity="0.4"/><rect x="65" y="50" width="6" height="8" fill="%23DEB887" opacity="0.3"/></pattern></defs><rect width="100%25" height="100%25" fill="url(%23cakes)"/></svg>',
    }
  },
  computed: {
    
  },
  methods: {
   
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
  },
};
</script>

<style scoped>
/* Unnecessary styles removed */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* All of the styling for the NavComp was removed as it is not needed here. */
/* The styles for the hero section, which are used in this component, are kept. */
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
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

/* Responsive Design for hero section only */
@media (max-width: 768px) {
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

  .category-buttons {
    gap: 15px;
  }

  .category-btn {
    font-size: 12px;
    padding: 12px 20px;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-box {
    padding: 30px 20px;
  }
}
</style>