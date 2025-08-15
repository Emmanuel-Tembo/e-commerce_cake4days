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
    
     <div class="form-section" v-if="formData.deliveryType === 'delivery'">
      <h2>Delivery Address</h2>
      <div class="form-group">
        <label for="street">Street Address</label>
        <input type="text" id="street" v-model="formData.shippingAddress.street" required />
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" v-model="formData.shippingAddress.city" required />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

    <div class="form-section" v-else="formData.deliveryType === 'collection '">
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
          <option>Pet cakes</option>
        </select>
      </div>

      <div class="form-group">
        <label>Cake Flavors</label>
        <select id="cakeType" v-model="formData.cakeType">
          <option disabled value="">Please select one</option>
          <option>Strawberry & Vinilla Cream cake</option>
          <option>Blueberry Cheese cake</option>
          <option>Bar-One Chocolate cake</option>
          <option>Chocolate Moose Cream Cake</option>
          <option>venilla cake</option>
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
  background-color: #f4e1ef;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(251, 255, 0, 0.803);
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
  color: #c54b04;
  position: relative;
  font-weight: bold;
  text-transform: uppercase;
  font-family: 'Courier New', Courier, monospace;
  text-shadow: 1px 1px 2px rgba(252, 231, 2, 0.949);
  letter-spacing: 1px;
  padding-bottom: 5px;
  
}

.form-section h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #efe9ea; 
  margin-top: 5px;
  border-radius: 2px;

}

.form-group {
  margin-bottom: 2.5rem;
  box-shadow:rgb(244, 139, 235) 0px 0px 10px;
  padding: 1rem;
  border-radius: 8px;
  background-color: #F8F64;
  transition: box-shadow 0.3s, transform 0.2s;
  border: 2px solid #ff69b4;
  color: #4e2a03;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #793b11;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #f5b2b2;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus, select:focus {
  border-color: #f777b7;
  box-shadow: 0 0 0 3px rgba(189, 26, 108, 0.2);
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;

}

.toggle-switch {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  color: #4e2a03;
  font-weight: bold;
}

.toggle-switch input[type="radio"] {
  display: none;
}

.toggle-switch label {
  padding: 10px 20px;
  border: 2px solid #c57575;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: normal;
}

.toggle-switch input[type="radio"]:checked + label {
  background-color: #cd67a1;
  color: white;
  border-color: #ffe600;
  font-weight: bold;
}

.drop-area {
  border: 2px dashed #ffea00; 
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #d29670d1;
}

.drop-area:hover {
  background-color: #c2fcff; 
}

.checkbox-group, .budget-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  color: #dc0dba;
  font-weight: bold;
}

.checkbox-group label, .budget-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border: 2px solid #ffd900;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
  background-color: #a6fbf7;
}

.submit-button {
  display:inline-flexbox;
  width: auto;
  max-width: 250px;
  margin: 2rem auto;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(brown, gold);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 12px rgba(255, 0, 162, 0.899);
  text-transform: uppercase;    
  letter-spacing: 1px;
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  margin-top: 2.1em;
}

.submit-button:hover {
  color: #000;
  box-shadow: 0 6px 14px rgba(200, 255, 0, 0.899);
  background-color: #14f7ff; 
  transform: translateY(-2px);
  transition: all 0.3s ease-in-out;
}
</style>