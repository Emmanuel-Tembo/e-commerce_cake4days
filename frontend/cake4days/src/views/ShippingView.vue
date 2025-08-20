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
        <h2 class="hero-title">Shipping & Delivery</h2>
        <div class="policy-content">
          <p>
            We are committed to getting our delicious treats to you fresh and on time. Please review our shipping and delivery policy below.
          </p>
          <h3>Order Processing</h3>
          <p>
            All orders are processed within 1-5 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>
          <h3>Local Delivery</h3>
          <p>
            We offer local delivery within a 15km radius of our bakery. Delivery fees will be calculated at checkout based on your location. You can select your preferred delivery date and time slot during the checkout process.
          </p>
          <h3>In-Store Pickup</h3>
          <p>
            You can skip the shipping fees with free local pickup at our store. After placing your order and selecting local pickup at checkout, your order will be prepared and ready for pick up within 1-2 business days. We will send you an email when your order is ready.
          </p>
          <h3>Damages</h3>
          <p>
            CakeForDays is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
           <p>
            If you have any questions about your order, feel free to contact us.
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
  name: 'ShippingPolicy',
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
