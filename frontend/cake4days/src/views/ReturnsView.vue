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
        <h2 class="hero-title">Returns & Refunds</h2>
        <div class="policy-content">
          <p>
            We take great pride in our treats and want you to be completely satisfied with your purchase. Due to the perishable nature of our products, we have a specific policy for returns and refunds.
          </p>
          <h3>Satisfaction Guarantee</h3>
          <p>
            If you are not satisfied with your order, please contact us within 24 hours of receiving it. We ask that you provide a photo of the product and a detailed description of the issue. We will review your request and, if appropriate, offer a credit for a future purchase.
          </p>
          <h3>Order Cancellations</h3>
          <p>
            For standard orders, you may cancel up to 48 hours before the scheduled pickup or delivery time for a full refund. For custom cake orders, we require a 7-day notice for cancellation to receive a full refund. Cancellations made after these timeframes may not be eligible for a refund.
          </p>
          <h3>Incorrect or Damaged Items</h3>
          <p>
            If you receive an incorrect item or your order is damaged upon arrival, please contact us immediately. We will work with you to make it right, which may include a replacement or a refund. Please provide your order number and photos of the incorrect or damaged product.
          </p>
           <p>
            For any questions regarding our returns and refunds policy, please don't hesitate to contact us.
          </p>
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
  name: 'ReturnsPolicy',
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

.policy-content h3 {
  font-size: 1.4rem;
  font-weight: 500;
  color: #F9D6D5;
  margin-top: 25px;
  margin-bottom: 10px;
}

.policy-content p {
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
  .policy-content p {
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
