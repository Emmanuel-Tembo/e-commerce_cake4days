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
        <div class="floating-dog">🐶</div>
      </div>
    </div>
    <div class="hero-content">
      <div class="hero-box">
        <h2 class="hero-title">Privacy Policy</h2>
        <div class="privacy-content">
          <p>
            Your privacy is important to us. It is CakeForDays' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
          </p>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>
          <p>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
          <p>
            We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>
          <p>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
          </p>
          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>
          <p>This policy is effective as of 20 August 2025.</p>
        </div>
      </div>
    </div>
  </section>
  <FootComp />
</template>

<script>
import Navbar from '../components/NavbarComp.vue';
import NavComp from '@/components/NavComp.vue';
import FootComp from '@/components/FootComp.vue';

export default {
  name: 'PrivacyPolicy',
  components: {
    Navbar,
    NavComp,
    FootComp
  },
  data() {
    return {
      backgroundImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="cakes" patternUnits="userSpaceOnUse" width="80" height="80"><rect width="80" height="80" fill="%23F9D6D5" opacity="0.1"/><circle cx="20" cy="20" r="8" fill="%23CD853F" opacity="0.3"/><rect x="35" y="15" width="10" height="10" fill="%238B5A3C" opacity="0.3"/><circle cx="60" cy="25" r="6" fill="%23DEB887" opacity="0.4"/><rect x="15" y="45" width="8" height="15" fill="%23CD853F" opacity="0.3"/><circle cx="45" cy="55" r="5" fill="%238B5A3C" opacity="0.4"/><rect x="65" y="50" width="6" height="8" fill="%23DEB887" opacity="0.3"/></pattern></defs><rect width="100%25" height="100%25" fill="url(%23cakes)"/></svg>',
    }
  },
  methods: {
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
  font-family: 'Poppins', sans-serif;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
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
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(139, 90, 60, 0.3);
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
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
  text-align: center;
}

.privacy-content p {
  font-size: 1rem;
  margin-bottom: 15px;
  opacity: 0.95;
  line-height: 1.8;
  font-weight: 300;
}

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
  .privacy-content p {
    font-size: 0.9rem;
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
