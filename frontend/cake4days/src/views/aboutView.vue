<template>
  <div class="about-page">
   
    <section class="hero">
      <div class="container">
        <h1>About Cake4Days</h1>
        <p class="tagline">Baking Memories for You & Your Furry Friends</p>
        <p class="subtagline">Online orders • Nationwide delivery • Seasonal pop-up experiences</p>
      </div>
    </section>

   
    <div class="container">
     
      <section class="intro-section">
        <p>At <strong>Cake4Days</strong>, we're redefining the bakery experience by bringing joy directly to your doorstep and through our exciting pop-up events. We create connections through delicious, personalized treats for you and your pets—no physical store needed!</p>
        
        <div class="online-highlight">
          <div class="icon">🛒</div>
          <div>
            <h3>100% Online Business</h3>
            <p>Order through our website for nationwide delivery. Customize every detail digitally with our easy-to-use design tools.</p>
          </div>
        </div>

        <div class="online-highlight">
          <div class="icon">🎪</div>
          <div>
            <h3>Pop-Up Experiences</h3>
            <p>Watch for our seasonal pop-up events where you can meet our bakers, sample treats, and enjoy special in-person only offers!</p>
            <button @click="showPopupSchedule" class="popup-btn">See Upcoming Pop-Ups</button>
          </div>
        </div>
      </section>

     
      <section class="usp-section">
        <h2>Our Digital-First Bakery Difference</h2>
        
        <div class="usp-grid">
          <div class="usp-card" v-for="(usp, index) in usps" :key="index">
            <div class="usp-icon">{{ usp.icon }}</div>
            <h3>{{ usp.title }}</h3>
            <p>{{ usp.description }}</p>
          </div>
        </div>
      </section>

     
      <section class="model-section">
        <h2>How We Work</h2>
        
        <div class="model-steps">
          <div class="step" v-for="(step, index) in steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </section>

 
      <div v-if="showPopups" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">×</button>
          <h2>Upcoming Pop-Up Events</h2>
          <div class="popup-list">
            <div v-for="(event, index) in popupEvents" :key="index" class="popup-event">
              <h3>{{ event.location }}</h3>
              <p class="date">{{ event.date }}</p>
              <p class="details">{{ event.details }}</p>
              <button @click="openRSVPForm(event)" class="rsvp-btn">RSVP</button>
            </div>
          </div>
          <p class="newsletter-text">
            Want pop-up announcements? <a href="#">Join our newsletter</a> | 
            <button @click="viewRSVPs" class="view-rsvps-btn">View All RSVPs ({{ submittedRSVPs.length }})</button>
          </p>
        </div>
      </div>

      
      <div v-if="showRSVPForm" class="modal-overlay" @click.self="closeRSVPForm">
        <div class="modal-content rsvp-modal">
          <button class="close-btn" @click="closeRSVPForm">×</button>
          <h2>RSVP for {{ selectedEvent.location }}</h2>
          <p class="event-info">{{ selectedEvent.date }}</p>
          
          <form @submit.prevent="submitRSVP" class="rsvp-form">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                v-model="rsvpForm.name" 
                required
                :class="{ 'error': errors.name }"
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                v-model="rsvpForm.email" 
                required
                :class="{ 'error': errors.email }"
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="rsvpForm.phone"
                placeholder="Optional"
              >
            </div>

            <div class="form-group">
              <label for="guests">Number of Guests</label>
              <select id="guests" v-model="rsvpForm.guests">
                <option value="1">Just me</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5+">5+ people</option>
              </select>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="rsvpForm.bringPet">
                I'll be bringing my pet
              </label>
            </div>

            <div class="form-group">
              <label for="dietary">Dietary Restrictions or Allergies</label>
              <textarea 
                id="dietary" 
                v-model="rsvpForm.dietary"
                rows="3"
                placeholder="Let us know about any allergies or dietary needs..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeRSVPForm" class="cancel-btn">Cancel</button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else>Submit RSVP</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    
      <div v-if="showSuccess" class="modal-overlay" @click.self="closeSuccess">
        <div class="modal-content success-modal">
          <div class="success-icon">🎉</div>
          <h2>RSVP Confirmed!</h2>
          <p>Thank you for your RSVP to <strong>{{ selectedEvent.location }}</strong>!</p>
          <p>We'll send you a confirmation email shortly with event details and directions.</p>
          <div class="rsvp-summary">
            <h3>Your RSVP Details:</h3>
            <p><strong>Name:</strong> {{ lastSubmittedRSVP.name }}</p>
            <p><strong>Email:</strong> {{ lastSubmittedRSVP.email }}</p>
            <p><strong>Guests:</strong> {{ lastSubmittedRSVP.guests }}</p>
            <p v-if="lastSubmittedRSVP.phone"><strong>Phone:</strong> {{ lastSubmittedRSVP.phone }}</p>
            <p v-if="lastSubmittedRSVP.bringPet">🐾 <strong>Bringing pet</strong></p>
            <p v-if="lastSubmittedRSVP.dietary"><strong>Dietary notes:</strong> {{ lastSubmittedRSVP.dietary }}</p>
            <p><strong>Confirmation #:</strong> {{ lastSubmittedRSVP.confirmationNumber }}</p>
          </div>
          <button @click="closeSuccess" class="ok-btn">Awesome!</button>
        </div>
      </div>

     
      <div v-if="showRSVPList" class="modal-overlay" @click.self="closeRSVPList">
        <div class="modal-content rsvp-list-modal">
          <button class="close-btn" @click="closeRSVPList">×</button>
          <h2>All Event RSVPs ({{ submittedRSVPs.length }})</h2>
          <div class="rsvp-filters">
            <select v-model="eventFilter">
              <option value="">All Events</option>
              <option v-for="event in popupEvents" :key="event.location" :value="event.location">
                {{ event.location }}
              </option>
            </select>
          </div>
          <div class="rsvp-list">
            <div v-if="filteredRSVPs.length === 0" class="no-rsvps">
              <p>No RSVPs yet. Be the first to RSVP to an event!</p>
            </div>
            <div v-for="(rsvp, index) in filteredRSVPs" :key="index" class="rsvp-item">
              <div class="rsvp-header">
                <h3>{{ rsvp.name }}</h3>
                <span class="confirmation-badge">#{{ rsvp.confirmationNumber }}</span>
              </div>
              <div class="rsvp-details">
                <p><strong>Event:</strong> {{ rsvp.event.location }}</p>
                <p><strong>Date:</strong> {{ rsvp.event.date }}</p>
                <p><strong>Email:</strong> {{ rsvp.email }}</p>
                <p><strong>Guests:</strong> {{ rsvp.guests }}</p>
                <p v-if="rsvp.phone"><strong>Phone:</strong> {{ rsvp.phone }}</p>
                <p v-if="rsvp.bringPet">🐾 <strong>Bringing pet</strong></p>
                <p v-if="rsvp.dietary"><strong>Dietary:</strong> {{ rsvp.dietary }}</p>
                <p><strong>Submitted:</strong> {{ formatDate(rsvp.submittedAt) }}</p>
              </div>
              <button @click="cancelRSVP(index)" class="cancel-rsvp-btn">Cancel RSVP</button>
            </div>
          </div>
          <div class="rsvp-stats">
            <h3>Event Statistics:</h3>
            <div v-for="event in eventStats" :key="event.name" class="stat-item">
              <strong>{{ event.name }}:</strong> {{ event.count }} RSVPs
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cake4DaysAbout',
  data() {
    return {
      showPopups: false,
      showRSVPForm: false,
      showSuccess: false,
      showRSVPList: false,
      isSubmitting: false,
      selectedEvent: {},
      eventFilter: '',
      rsvpForm: {
        name: '',
        email: '',
        phone: '',
        guests: '1',
        bringPet: false,
        dietary: ''
      },
      errors: {},
      submittedRSVPs: [],
      usps: [
        {
          icon: '🎂',
          title: 'Virtual Cake Design',
          description: 'Our interactive design tool lets you create custom cakes online with real-time previews'
        },
        {
          icon: '🚚',
          title: ' Shipping',
          description: 'Fresh treats delivered anywhere in the country with specialized packaging'
        },
        {
          icon: '🐾',
          title: 'Pet Subscription Boxes',
          description: 'Monthly deliveries of healthy pet treats tailored to your furry friend'
        },
        {
          icon: '💻',
          title: 'Digital Consultations',
          description: 'Video calls with our bakers to plan your perfect event treats'
        }
      ],
      steps: [
        {
          title: 'Order Online',
          description: 'Browse our digital catalog or use our design tools to create your perfect treat'
        },
        {
          title: 'Virtual Consultation',
          description: 'Optional video call with our bakers to perfect your design (for complex orders)'
        },
        {
          title: 'Baked Fresh',
          description: 'We prepare your order in our commercial kitchen with premium ingredients'
        },
        {
          title: 'Delivery or Pickup',
          description: 'Choose delivery to your door or pickup at our next pop-up event'
        }
      ],
      popupEvents: [
        {
          location: 'Downtown Food Festival',
          date: 'November 15-17, 2023',
          details: 'Meet our bakers, sample new flavors, and enjoy 15% off all pre-orders placed at the event'
        },
        {
          location: 'Holiday Market at City Park',
          date: 'December 8-10, 2023',
          details: 'Special holiday-themed treats and pet-friendly decorating station'
        },
        {
          location: 'Pet Lovers Expo',
          date: 'January 20, 2024',
          details: 'Exclusive pet treat samples and photo ops with your furry friends'
        }
      ]
    }
  },
  computed: {
    lastSubmittedRSVP() {
      return this.submittedRSVPs[this.submittedRSVPs.length - 1] || {};
    },
    filteredRSVPs() {
      if (!this.eventFilter) return this.submittedRSVPs;
      return this.submittedRSVPs.filter(rsvp => rsvp.event.location === this.eventFilter);
    },
    eventStats() {
      const stats = {};
      this.submittedRSVPs.forEach(rsvp => {
        const eventName = rsvp.event.location;
        stats[eventName] = (stats[eventName] || 0) + 1;
      });
      return Object.entries(stats).map(([name, count]) => ({ name, count }));
    }
  },
  mounted() {
    
    const savedRSVPs = this.loadFromMemory('cake4days_rsvps');
    if (savedRSVPs) {
      this.submittedRSVPs = savedRSVPs;
    }
  },
  methods: {
    showPopupSchedule() {
      this.showPopups = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showPopups = false;
      document.body.style.overflow = 'auto';
    },
    openRSVPForm(event) {
      this.selectedEvent = event;
      this.showPopups = false;
      this.showRSVPForm = true;
      this.resetForm();
    },
    closeRSVPForm() {
      this.showRSVPForm = false;
      document.body.style.overflow = 'auto';
      this.resetForm();
    },
    closeSuccess() {
      this.showSuccess = false;
      document.body.style.overflow = 'auto';
    },
    viewRSVPs() {
      this.showPopups = false;
      this.showRSVPList = true;
      this.eventFilter = '';
    },
    closeRSVPList() {
      this.showRSVPList = false;
      document.body.style.overflow = 'auto';
    },
    resetForm() {
      this.rsvpForm = {
        name: '',
        email: '',
        phone: '',
        guests: '1',
        bringPet: false,
        dietary: ''
      };
      this.errors = {};
    },
    validateForm() {
      this.errors = {};
      
      if (!this.rsvpForm.name.trim()) {
        this.errors.name = 'Name is required';
      }
      
      if (!this.rsvpForm.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.rsvpForm.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
     
      const existingRSVP = this.submittedRSVPs.find(rsvp => 
        rsvp.email.toLowerCase() === this.rsvpForm.email.toLowerCase() && 
        rsvp.event.location === this.selectedEvent.location
      );
      
      if (existingRSVP) {
        this.errors.email = 'You have already RSVPed to this event';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    generateConfirmationNumber() {
      return Math.random().toString(36).substr(2, 8).toUpperCase();
    },
    async submitRSVP() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const rsvpRecord = {
        ...this.rsvpForm,
        event: { ...this.selectedEvent },
        submittedAt: new Date().toISOString(),
        confirmationNumber: this.generateConfirmationNumber()
      };
      
      
      this.submittedRSVPs.push(rsvpRecord);
      
      
      this.saveToMemory('cake4days_rsvps', this.submittedRSVPs);
      
      this.isSubmitting = false;
      this.showRSVPForm = false;
      this.showSuccess = true;
      

      this.sendConfirmationEmail(rsvpRecord);
      
      console.log('RSVP Successfully Submitted:', rsvpRecord);
    },
    cancelRSVP(index) {
      if (confirm('Are you sure you want to cancel this RSVP?')) {
        const cancelledRSVP = this.submittedRSVPs.splice(index, 1)[0];
        this.saveToMemory('cake4days_rsvps', this.submittedRSVPs);
        alert(`RSVP for ${cancelledRSVP.name} has been cancelled.`);
      }
    },
    sendConfirmationEmail(rsvp) {
    
      console.log(`📧 Confirmation email sent to ${rsvp.email}`);
      console.log(`Subject: RSVP Confirmed for ${rsvp.event.location}`);
      console.log(`Confirmation Number: ${rsvp.confirmationNumber}`);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    
    saveToMemory(key, data) {
     
      window.tempStorage = window.tempStorage || {};
      window.tempStorage[key] = JSON.stringify(data);
    },
    loadFromMemory(key) {
      
      if (window.tempStorage && window.tempStorage[key]) {
        return JSON.parse(window.tempStorage[key]);
      }
      return null;
    }
  }
}
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.about-page {
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
  padding-bottom: 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(rgba(255, 107, 136, 0.8), rgba(255, 107, 136, 0.9)), 
              url('https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 80px 20px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
}

.tagline {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 10px;
}

.subtagline {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Introduction Section */
.intro-section {
  margin-bottom: 60px;
}

.online-highlight {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 25px;
  margin: 30px 0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.online-highlight .icon {
  font-size: 2.5rem;
  margin-right: 25px;
  flex-shrink: 0;
}

.popup-btn {
  background: #ff6b88;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.popup-btn:hover {
  background: #e05572;
  transform: translateY(-2px);
}

/* USP Section */
.usp-section {
  margin: 60px 0;
}

h2 {
  text-align: center;
  color: #ff6b88;
  font-size: 2rem;
  margin-bottom: 40px;
}

.usp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.usp-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.usp-card:hover {
  transform: translateY(-5px);
}

.usp-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.usp-card h3 {
  color: #ff6b88;
  margin-bottom: 15px;
}

/* Model Section */
.model-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.step {
  position: relative;
  padding: 30px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.step-number {
  position: absolute;
  top: -20px;
  left: 20px;
  background: #ff6b88;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step h3 {
  margin-top: 15px;
  color: #ff6b88;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.popup-list {
  margin-top: 20px;
}

.popup-event {
  background: #fff9f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.popup-event h3 {
  color: #ff6b88;
  margin-bottom: 5px;
}

.date {
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.rsvp-btn {
  background: #ff6b88;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}

.rsvp-btn:hover {
  background: #e05572;
}

.newsletter-text {
  margin-top: 20px;
  text-align: center;
}

.view-rsvps-btn {
  background: none;
  border: none;
  color: #ff6b88;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.view-rsvps-btn:hover {
  color: #e05572;
}

/* RSVP Form Styles */
.rsvp-modal {
  max-width: 500px;
}

.event-info {
  color: #666;
  margin-bottom: 25px;
  font-weight: bold;
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b88;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.checkbox-group label {
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input {
  margin-right: 10px;
  width: auto;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #ddd;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #ccc;
}

.submit-btn {
  padding: 10px 20px;
  background: #ff6b88;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #e05572;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Success Modal */
.success-modal {
  text-align: center;
  max-width: 400px;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.success-modal h2 {
  color: #ff6b88;
  margin-bottom: 15px;
}

.success-modal p {
  margin-bottom: 15px;
  color: #666;
}

.rsvp-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.rsvp-summary h3 {
  color: #ff6b88;
  margin-bottom: 15px;
  text-align: center;
}

.rsvp-summary p {
  margin-bottom: 8px;
  color: #333;
}

.ok-btn {
  background: #ff6b88;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background 0.3s;
}

.ok-btn:hover {
  background: #e05572;
}

/* RSVP List Modal Styles */
.rsvp-list-modal {
  max-width: 700px;
}

</style>