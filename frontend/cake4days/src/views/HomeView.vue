<template>
  <NavComp />
  <Navbar />
  <section class="hero" :style="{ backgroundImage: getHeroBackground() }">
            <div class="hero-background">
              <div class="floating-elements">
                <div class="floating-cake">🎂</div>
                <div class="floating-cupcake">🧁</div>
                <div class="floating-cookie">🍪</div>
                <div class="floating-paw">🐾</div>
                <div class="floating-dog">🐕</div>
              </div>
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

                <div class="category-buttons">
                  <button class="category-btn human" @click="viewCategory('human')">
                    <span>🎂</span>
                    Cakes
                  </button>
                  <button class="category-btn pet" @click="viewPetTreats">
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
// import { mapGetters } from 'vuex';
// import { useCartStore } from '@/store/cart';
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

      if(category === 'human'){
        this.$router.push('/catalogue');
      }else if (category === 'pet'){
        this.$router.push('/PetTreats');
      }
  },
    viewCakes() {
      console.log(`Viewing cakes...`);
      this.$router.push('/catalogue');
    },
    viewPetTreats(){
      console.log('Viewing pet treats...');
      this.$router.push('/PetTreats');
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

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.cake-website {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  /* min-height: 100vh; */
  background: linear-gradient(135deg, #FAF0E6 0%, #F5E6D3 100%);
}

.container-fluid {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

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
  position: sticky;
  top: 0;
  z-index: 80;
  background-color: #f19bbd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  left: 0;
  right: auto;
}

.logo {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.logo-text {
  font-family: 'Pacifico', cursive;
  color: #d23c67;
  font-size: 2.2rem;
  margin-bottom: 0;
  letter-spacing: 2px;
  text-shadow: none;
}

.logo-tagline {
  font-size: 1.1rem;
  color: #333;
  font-weight: 400;
  margin-top: -8px;
  letter-spacing: 1px;
  text-transform: none;
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
  /* background-image:
    radial-gradient(circle at 20% 80%, rgba(205, 133, 63, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(222, 184, 135, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 90, 60, 0.1) 0%, transparent 30%);
  background-image: linear-gradient(-45deg, #F9D6D5, #F5E6D3, #F5E6D3, #DEB887, #CD853F);
  background-size: 400% 400%;
  animation: gradientsBG 15s ease infinite;  */
  pointer-events: none;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.floating-cake,
.floating-cupcake,
.floating-cookie,
.floating-paw,
.floating-dog {
  position: absolute;
  font-size: 30px;
  opacity: 0.15;
  animation: float 15s linear infinite;
  z-index: 1;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
}

.floating-cake {
  top: 10%;
  left: -50px;
  animation-delay: 0s;
  font-size: 40px;
}

.floating-cupcake {
  top: 30%;
  left: -50px;
  animation-delay: 3s;
  font-size: 35px;
}

.floating-cookie {
  top: 50%;
  left: -50px;
  animation-delay: 6s;
  font-size: 30px;

}

.floating-paw {
  top: 70%;
  left: -50px;
  animation-delay: 9s;
  font-size: 25px;
}

.floating-dog {
  top: 85%;
  left: -50px;
  animation-delay: 12s;
  font-size: 30px;
}

@keyframes float {
  0% {
    transform: translateX(-50px) translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.15;
  }

  90% {
    opacity: 0.15;
  }

  100% {
    transform: translateX(calc(100vw + 50px)) translateY(-50px) rotate(360deg);
    opacity: 0;
  }
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


.hero {
  padding: 40px 20px;
  background: linear-gradient(135deg, #ffe5ec 0%, #ff6b8b 100%);
  /* PetTreatsView color palette */
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
  background: #ff6b8b;
  /* Coral pink */
  color: white;
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
  box-shadow: 0 15px 40px rgba(255, 107, 139, 0.2);
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: 2px solid #ffe5ec;
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
  background: #d23c67;
  /* Dark pink hover */
  box-shadow: 0 25px 60px rgba(255, 107, 139, 0.3);
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