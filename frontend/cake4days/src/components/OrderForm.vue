<template>
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
      <div class="form-group delivery-options">
        <label>Collection / Delivery</label>
        <div class="toggle-switch">
          <input type="radio" id="collection" value="collection" v-model="formData.deliveryType" />
          <label for="collection">Collection</label>
          <input type="radio" id="delivery" value="delivery" v-model="formData.deliveryType" />
          <label for="delivery">Delivery</label>
        </div>
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
        <label for="cakeType">Type of Cake</label>
        <select id="cakeType" v-model="formData.cakeType">
          <option disabled value="">Please select one</option>
          <option>Birthday Cake</option>
          <option>Wedding Cake</option>
          <option>Cupcakes</option>
          <option>Tiered Cake</option>
          <option>Pet cake</option>
        </select>
      </div>

      <div class="form-group">
        <label>Cake Flavors</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Vanilla" v-model="formData.flavors" /> Vanilla</label>
          <label><input type="checkbox" value="Chocolate" v-model="formData.flavors" /> Chocolate</label>
          <label><input type="checkbox" value="Red Velvet" v-model="formData.flavors" /> Red Velvet</label>
          <label><input type="checkbox" value="Blue berry Cheese Cake" v-model="formData.flavors" /> Blue berry Cheese Cake</label>
          <label><input type="checkbox" value="Bar-One Charamal Cream Cake" v-model="formData.flavors" /> Bar-One Charamal Cream Cake</label>
        </div>
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
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'OrderForm',
  setup() {
    // Reactive data for the form inputs
    const formData = ref({
      fullName: '',
      email: '',
      phone: '',
      deliveryType: 'collection',
      description: '',
      files: [],
      occasion: '',
      eventDate: '',
      cakeType: '',
      flavors: [],
      budget: ''
    });

    const fileInput = ref(null);

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
    const submitOrder = () => {
      // Here you handle the form data.
      // 1. You could send this data to your Node.js backend using a library like Axios.
      // 2. You might show a success message to the user.
      console.log('Form Submitted!', formData.value);
      // Example of an API call (you'll need to set this up)
      /*
      axios.post('/api/orders', formData.value)
        .then(response => {
          alert('Order placed successfully!');
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      */
    };

    return {
      formData,
      fileInput,
      handleFileChange,
      handleFileDrop,
      openFilePicker,
      submitOrder,
    };
  },
};
</script>

<style scoped>
.order-form {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 2rem;
  background-color: #fce0f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


@media (max-width: 768px) {
  .order-form {
    grid-template-columns: 1fr; 
    padding: 1rem;
    gap: 1.5rem;
  }
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #c50478;
  position: relative;
}

.form-section h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #f28abe; 
  margin-top: 5px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #bc5f12;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus, select:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.toggle-switch {
  display: flex;
  gap: 1rem;
}

.toggle-switch input[type="radio"] {
  display: none;
}

.toggle-switch label {
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: normal;
}

.toggle-switch input[type="radio"]:checked + label {
  background-color: #ff69b4;
  color: white;
  border-color: #ff69b4;
  font-weight: bold;
}

.drop-area {
  border: 2px dashed #ffb6c1; 
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.drop-area:hover {
  background-color: #fff0f5; 
}

.checkbox-group, .budget-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.checkbox-group label, .budget-options label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #ff69b4;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #ff1493; 
  transform: translateY(-2px);
}
</style>