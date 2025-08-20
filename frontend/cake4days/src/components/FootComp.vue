<template>
  <footer class="footer-container" :style="{ backgroundImage: getFooterBackground() }">
    <div class="footer-overlay">
      <div class="footer-content">
        
        <div class="footer-links">
          <h3>Quick Links</h3>
          <router-link to="/">Home</router-link>
          <router-link to="/catalogue">Shop</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/contact">Contact</router-link>
        </div>

        <div class="footer-links">
          <h3>Customer Service</h3>
          <router-link to="/faq">FAQ</router-link>
          <router-link to="/shipping">Shipping</router-link>
          <router-link to="/returns">Returns</router-link>
          <router-link to="/privacy-policy">Privacy Policy</router-link>
        </div>

        <div class="footer-links">
          <h3>Get in Touch</h3>
          <p>Email: support@cakefordays.com</p>
          <p>Phone: +27 123 456 789</p>
          <p>Location: Cape Town, South Africa</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Cake For Days. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComp',
  data() {
    return {
      footerBackgroundImage:
        'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=1200&h=400&fit=crop',
    };
  },
  methods: {
    getFooterBackground() {
      if (!this.footerBackgroundImage) {
        return 'linear-gradient(135deg, #8B5A3C 0%, #A0522D 50%, #CD853F 100%)';
      }
      return `linear-gradient(rgba(139, 90, 60, 0.9), rgba(160, 82, 45, 0.9)), url('${this.footerBackgroundImage}')`;
    },
  },
};
</script>

<style scoped>
.footer-container {
  position: relative;
  background-size: cover;
  background-position: center;
  color: white;
  margin: 0;
}

.footer-overlay {
  background: rgba(0, 0, 0, 0.319);
  padding: 60px 20px 20px;
  min-height: 100%;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  text-align: left;
}

.footer-links h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #FFDAB9;
}


.footer-links a,
.footer-links p {
  display: block;
  color: #f5f5f5;
  font-size: 14px;
  margin-bottom: 8px;
  transition: color 0.3s;
  cursor: pointer;
}


.footer-links a:hover {
  color: #FFDAB9;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 30px;
  padding-top: 15px;
  text-align: center;
  font-size: 13px;
  opacity: 0.8;
}
</style>