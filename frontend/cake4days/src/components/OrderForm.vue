<template>
  <div class="custom-order-page">
    <div class="container">
      <p :class="['subtitle', { 'is-visible': isSubtitleVisible }]">Tell us about your perfect cake and we'll bring it to life!</p>

      <form @submit.prevent="submitOrder" class="order-form">
        <div class="form-section">
          <h2>Your Details</h2>
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="formData.fullName" required />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="formData.phone" />
          </div>
        </div>
        
        <div class="form-section">
          <h2>Delivery Address</h2>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" v-model="formData.shippingAddress.street" required />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="formData.shippingAddress.city" required />
          </div>
          <div class="grid-2-cols">
            <div class="form-group">
              <label for="state">State</label>
              <input type="text" id="state" v-model="formData.shippingAddress.state" required />
            </div>
            <div class="form-group">
              <label for="zip">Zip/Postal Code</label>
              <input type="text" id="zip" v-model="formData.shippingAddress.zip" required />
            </div>
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="formData.shippingAddress.country" required />
          </div>
        </div>

        <div class="form-section">
          <h2>Cake Details</h2>
          <div class="form-group">
            <label for="description">Tell us about your dream cake!</label>
            <textarea id="description" v-model="formData.description" placeholder="Specific colors, themes, number of tiers..."></textarea>
          </div>
          
          <div class="form-group">
            <label>Inspiration Pictures</label>
            <div class="drop-area" 
              @dragover.prevent @drop="handleFileDrop"
              @click="openFilePicker">
              <p>Drag & drop your files here or click to browse</p>
              <input type="file" ref="fileInput" @change="handleFileChange" multiple accept="image/*" style="display: none;" />
            </div>
            <ul v-if="formData.files.length">
              <li v-for="(file, index) in formData.files" :key="index">{{ file.name }}</li>
            </ul>
          </div>

          <div class="form-group">
            <label for="occasion">What's the occasion?</label>
            <input type="text" id="occasion" v-model="formData.occasion" />
          </div>

          <div class="form-group">
            <label for="eventDate">Date of Event</label>
            <input type="date" id="eventDate" v-model="formData.eventDate" required />
          </div>

          <div class="form-group">
            <label for="servings">Number of Servings</label>
            <input type="number" id="servings" v-model.number="formData.servings" min="1" placeholder="e.g., 10" />
          </div>

          <div class="form-group">
            <label for="dietary">Dietary Requirements (e.g., vegan, gluten-free)</label>
            <input type="text" id="dietary" v-model="formData.dietaryRequirements" />
          </div>
          
          <div class="form-group">
            <label for="cakeType">Type of Cake</label>
            <select id="cakeType" v-model="formData.cakeType">
              <option disabled value="">Please select one</option>
              <option>Birthday Cake</option>
              <option>Wedding Cake</option>
              <option>Cupcakes</option>
              <option>Tiered Cake</option>
              <option>Pet cakes</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cake Flavors</label>
            <select id="cakeFlavors" v-model="formData.flavors">
              <option disabled value="">Please select one</option>
              <option>Strawberry & Vanilla Cream cake</option>
              <option>Blueberry Cheese cake</option>
              <option>Bar-One Chocolate cake</option>
              <option>Chocolate Moose Cream Cake</option>
              <option>Vanilla cake</option>
            </select>
          </div>

          <div class="form-group">
            <label>Budget Checklist</label>
            <div class="budget-options">
              <label><input type="radio" value="500-1000" v-model="formData.budget" /> R500 - R1,000</label>
              <label><input type="radio" value="1001-2000" v-model="formData.budget" /> R1,001 - R2,000</label>
              <label><input type="radio" value="2001+" v-model="formData.budget" /> R2,001+</label>
            </div>
          </div>
        </div>
        
        <button type="submit" class="submit-button">Submit Your Order</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'OrderForm',
  setup() {
    const store = useStore();
    // Reactive data for the form inputs
    const formData = ref({
      fullName: '',
      email: '',
      phone: '',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      description: '',
      files: [],
      occasion: '',
      eventDate: '',
      servings: null,
      dietaryRequirements: '',
      cakeType: '',
      flavors: [],
      budget: ''
    });

    const fileInput = ref(null);
    const isSubtitleVisible = ref(false); // Make sure this is also defined
    let observer = null;

    // Methods for handling file uploads
    const handleFileChange = (event) => {
      formData.value.files = [...formData.value.files, ...event.target.files];
    };

    const handleFileDrop = (event) => {
      event.preventDefault();
      formData.value.files = [...formData.value.files, ...event.dataTransfer.files];
    };

    const openFilePicker = () => {
      fileInput.value.click();
    };

    // Method to handle form submission
    const submitOrder = async () => {
      try {
        // Create a payload that matches your backend API's expected format
         const payload = {
      // Your user details match
      fullName: formData.value.fullName,
      email: formData.value.email,
      phone: formData.value.phone,
      
      // Map shippingAddress keys to match the database schema
      streetAddress: formData.value.shippingAddress.street, // Renamed from 'street'
      city: formData.value.shippingAddress.city,
      state: formData.value.shippingAddress.state,
      zipCode: formData.value.shippingAddress.zip, // Renamed from 'zip'
      country: formData.value.shippingAddress.country,
      
      // Map other details to match the model and email service
      event_type: formData.value.occasion, // Renamed from 'occasion'
      event_date: formData.value.eventDate, // Renamed from 'eventDate'
      number_of_servings: formData.value.servings, // Renamed from 'servings'
      dietary_requirements: formData.value.dietaryRequirements, // Renamed from 'dietaryRequirements'
      cake_type: formData.value.cakeType, // Renamed from 'cakeType'
      preferred_flavours: formData.value.flavors, // Renamed from 'flavors'
      budget_range: formData.value.budget, // Renamed from 'budget'
      special_requests: formData.value.description, // Renamed from 'description'
    };
        // Dispatch the new Vuex action
        await store.dispatch('submitCustomOrder', payload);

        // Notify the user of success
        alert('Your custom order has been submitted! We will contact you within 24 hours.');

        // Optionally, reset the form
        resetForm();

      } catch (error) {
        alert('Failed to submit your order. Please try again.');
        console.error('Submission error:', error);
      }
    };

    onMounted(() => {
      const subtitleElement = document.querySelector('.subtitle');
      if (subtitleElement) {
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.5
        };
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isSubtitleVisible.value = entry.isIntersecting;
          });
        }, options);
        observer.observe(subtitleElement);
      }
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
      }
    });
    const resetForm = () => {
        formData.value = {
            fullName: '',
            email: '',
            phone: '',
            shippingAddress: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            description: '',
            files: [],
            occasion: '',
            eventDate: '',
            servings: null,
            dietaryRequirements: '',
            cakeType: '',
            flavors: [],
            budget: ''
        };
    };

    return {
      formData,
      fileInput,
      handleFileChange,
      handleFileDrop,
      openFilePicker,
      submitOrder,
      isSubtitleVisible
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.custom-order-page {
  font-family: 'Poppins', sans-serif;
  padding: 40px 20px;
  background: linear-gradient(135deg, #FAF0E6 0%, #F5E6D3 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: #333;
}


.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #D23C67;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #8B5A3C;
  font-size: 1.4rem; /* Made bigger as requested */
  font-weight: 500;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px); /* Larger initial translateY for a more pronounced slide-in effect */
  transition: opacity 0.8s ease-out, transform 0.8s ease-out; /* The animation transition */
}

.subtitle.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.order-form {
  display: grid;
  gap: 2rem;
}

.form-section {
  background: #fdfdfd;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.form-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.form-section h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background: #F9D6D5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #666;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #F19BBD;
  box-shadow: 0 0 0 3px rgba(241, 155, 189, 0.2);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.grid-2-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.toggle-switch input {
  display: none;
}

.toggle-switch label {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;
  font-weight: 500;
}

.toggle-switch input:checked + label {
  color: #fff;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #D23C67;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.toggle-switch input#delivery:checked ~::after {
  transform: translateX(100%);
}

.drop-area {
  border: 2px dashed #D23C67;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #D23C67;
  background: #fff8f8;
}

.drop-area:hover {
  background: #fef0f0;
}

.drop-area p {
  margin: 0;
  font-weight: 500;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: #F19BBD;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(241, 155, 189, 0.3);
}

.submit-button:hover {
  background-color: #D23C67;
  box-shadow: 0 12px 25px rgba(210, 60, 103, 0.4);
  transform: translateY(-2px);
}
</style>