<template>
  <div class="payment-page">
    <div class="container">
      <h1 class="page-title">Finalizing Your Order</h1>
      <p class="subtitle">Just a few more steps to make your cake dreams a reality.</p>

      <!-- Checkout Prompt: Sign In vs. Guest -->
      <div v-if="checkoutStage === 'prompt'" class="checkout-prompt">
        <h2>How would you like to check out?</h2>
        <div class="prompt-buttons">
          <button @click="startGuestCheckout" class="guest-button">
            Continue as Guest
          </button>
          <button @click="handleSignIn" class="sign-in-button">
            Sign In
          </button>
        </div>
      </div>

      <!-- Guest Details Form -->
      <div v-else-if="checkoutStage === 'guest_details'" class="guest-details-form">
        <h2>Enter Your Shipping Details</h2>
        <form @submit.prevent="continueToPayment">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="formData.fullName" required />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" v-model="formData.shippingAddress.street" required />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="formData.shippingAddress.city" required />
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="formData.shippingAddress.country" required />
          </div>
          <button type="submit" class="submit-button">Continue to Payment</button>
        </form>
      </div>

      <!-- Payment Section -->
      <div v-else-if="checkoutStage === 'payment'" class="payment-grid">
        <!-- Order Summary Section -->
        <div class="summary-section">
          <h2>Order Summary</h2>
          <div class="summary-details">
            <div class="summary-item" v-for="item in cartStore.cartItems" :key="item.id">
              <span>{{ item.name }} (x{{ item.quantity }})</span>
              <span>R{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="summary-item subtotal">
              <span>Subtotal:</span>
              <span>R{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>Shipping:</span>
              <span>R{{ shipping.toFixed(2) }}</span>
            </div>
            <div class="summary-item total">
              <span>Total:</span>
              <span>R{{ total.toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-details">
            <h3>Your Details</h3>
            <p><strong>Name:</strong> {{ formData.fullName }}</p>
            <p><strong>Email:</strong> {{ formData.email }}</p>
            <h3>Shipping To</h3>
            <p>{{ formData.shippingAddress.street }}, {{ formData.shippingAddress.city }}</p>
            <p>{{ formData.shippingAddress.country }}</p>
          </div>
        </div>

        <!-- Payment Form Section -->
        <div class="form-section">
          <h2>Payment Details</h2>
          
          <div class="payment-tabs">
            <button 
              :class="{ 'tab-button': true, 'active': activePaymentMethod === 'card' }" 
              @click="setActiveMethod('card')">
              Credit Card
            </button>
            <button 
              :class="{ 'tab-button': true, 'active': activePaymentMethod === 'paypal' }" 
              @click="setActiveMethod('paypal')">
              PayPal
            </button>
          </div>
          
          <div v-if="activePaymentMethod === 'card'" class="payment-form-container">
            <form @submit.prevent="submitPayment">
              <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" v-model="paymentData.cardNumber" placeholder="•••• •••• •••• ••••" required />
              </div>
              
              <div class="grid-2-cols">
                <div class="form-group">
                  <label for="expDate">Expiration Date</label>
                  <input type="text" id="expDate" v-model="paymentData.expDate" placeholder="MM / YY" required />
                </div>
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input type="text" id="cvv" v-model="paymentData.cvv" placeholder="•••" required />
                </div>
              </div>
  
              <div class="form-group">
                <label for="cardHolderName">Cardholder Name</label>
                <input type="text" id="cardHolderName" v-model="paymentData.cardHolderName" required />
              </div>
  
              <button type="submit" class="submit-button">Pay with Card</button>
            </form>
          </div>

          <div v-else-if="activePaymentMethod === 'paypal'" class="payment-form-container paypal-container">
            <p>You will be redirected to PayPal to complete your purchase.</p>
            <button class="submit-button" @click="submitPayment">Pay with PayPal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/store/cart'; // Adjust the path to your store file
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; 

export default {
  name: 'PaymentPage',
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();
    const store = useStore();
    const checkoutStage = ref('prompt'); // 'prompt', 'guest_details', or 'payment'
    const activePaymentMethod = ref('card');

    const formData = ref({
      fullName: '',
      email: '',
      shippingAddress: {
        street: '',
        city: '',
        country: ''
      }
    });

    const paymentData = ref({
      cardNumber: '',
      expDate: '',
      cvv: '',
      cardHolderName: ''
    });

    const shipping = computed(() => {
      return cartStore.subtotal > 500 ? 50.00 : 75.00;
    });

    const total = computed(() => {
      return cartStore.subtotal + shipping.value;
    });

    const authenticatedUser = computed(() => store.state.isAuthenticated);
    const userProfile = computed(() => store.state.user);

    // Call checkAuth on mount to verify the user's session
    onMounted(() => {
      if (authenticatedUser.value) {
        if (userProfile.value) {
          formData.value.fullName = userProfile.value.username;
          formData.value.email = userProfile.value.email;
          if (userProfile.value.addresses && userProfile.value.addresses.length > 0) {
            const defaultAddress = userProfile.value.addresses[0];
            formData.value.shippingAddress = {
              street: defaultAddress.street || '',
              city: defaultAddress.city || '',
              country: defaultAddress.country || ''
            };
          }
        }
        checkoutStage.value = 'payment';
      }
    });

    const createOrder = async () => {
      try {
        const orderDetails = {
          items: cartStore.cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          })),
          total: total.value,
          shippingAddress: formData.value.shippingAddress,
          // Conditionally add the user_id if the user is logged in
          user_id: authenticatedUser.value ? userProfile.value.user_id : null,
          email: formData.value.email // Always send the email
        };

        const response = await axios.post('/orders/create', orderDetails);
        return response.data; // This should contain the new order_id
      } catch (e) {
        console.error('Order creation failed:', e.response?.data?.message || e.message);
        throw e;
      }
    };

    const setActiveMethod = (method) => {
      activePaymentMethod.value = method;
    };

    const startGuestCheckout = () => {
      checkoutStage.value = 'guest_details';
    };

    const continueToPayment = () => {
      // Basic validation check
      if (formData.value.fullName && formData.value.email && formData.value.shippingAddress.street) {
        checkoutStage.value = 'payment';
      } else {
        alert('Please fill in all shipping details to continue.');
      }
    };

    const handleSignIn = () => {
      // Placeholder for your sign-in logic
      console.log('Redirecting to sign-in page...');
      router.push('/sign');
      // In a real app, you would navigate to your login/sign-up page here.
    };

      
      const submitPayment = async () => {
      // 1. Create the order first
      let orderId;
      try {
        const orderResponse = await createOrder();
        orderId = orderResponse.orderId;
        alert(`Order ${orderId} created successfully. Now processing payment...`);
      } catch (error) {
        alert('Failed to create order. Please try again.');
        return;
      }

      // 2. Prepare the payment payload with the real orderId
      const paymentPayload = {
        orderId: orderId,
        amount: total.value,
        paymentMethod: activePaymentMethod.value === 'card' ? 'creditCard' : 'paypal',
        paymentDetails: activePaymentMethod.value === 'card' ? { ...paymentData.value } : null
      };

      try {
        // 3. Call the action in your Pinia store to process payment
        const result = await cartStore.processPayment(paymentPayload);

        if (result.success) {
          alert('Payment successful! Redirecting to confirmation page.');
          // Redirect the user to a success page
          router.push('/order-confirmation');
          cartStore.$resetCart();
        } else {
          alert(`Payment failed: ${result.message}`);
        }
      } catch (error) {
        alert('An unexpected error occurred during payment.');
      }
    };

    return {
      cartStore,
      formData,
      paymentData,
      shipping,
      total,
      activePaymentMethod,
      checkoutStage,
      authenticatedUser,
      setActiveMethod,
      startGuestCheckout,
      continueToPayment,
      handleSignIn,
      submitPayment
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.payment-page {
  font-family: 'Poppins', sans-serif;
  padding: 40px 20px;
  background: linear-gradient(135deg, #FAF0E6 0%, #F5E6D3 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: #333;
}

.container {
  background: #fff;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  width: 100%;
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
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.summary-section,
.form-section {
  background: #fdfdfd;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.summary-section h2,
.form-section h2,
.checkout-prompt h2,
.guest-details-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  text-align: center;
}

.summary-section h2::after,
.form-section h2::after,
.checkout-prompt h2::after,
.guest-details-form h2::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 50px;
  height: 3px;
  background: #F9D6D5;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.summary-item.subtotal {
  font-weight: 700;
}

.summary-item.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #D23C67;
}

.order-details h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #8B5A3C;
}

.order-details p {
  margin: 0.25rem 0;
  color: #666;
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

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

input:focus {
  outline: none;
  border-color: #F19BBD;
  box-shadow: 0 0 0 3px rgba(241, 155, 189, 0.2);
}

.grid-2-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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

.payment-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2rem;
}

.tab-button {
  background: #fdfdfd;
  color: #D23C67;
  padding: 10px 20px;
  border: 2px solid #F19BBD;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: #F19BBD;
  color: white;
  box-shadow: 0 5px 15px rgba(241, 155, 189, 0.3);
}

.tab-button:hover:not(.active) {
  background: #F9D6D5;
}

.paypal-container {
  text-align: center;
}

.checkout-prompt {
  background: #fdfdfd;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.prompt-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 2rem;
}

.guest-button,
.sign-in-button {
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.guest-button {
  background-color: #F19BBD;
  color: white;
  box-shadow: 0 8px 20px rgba(241, 155, 189, 0.3);
}

.guest-button:hover {
  background-color: #D23C67;
  transform: translateY(-2px);
}

.sign-in-button {
  background-color: #fff;
  color: #8B5A3C;
  border: 2px solid #8B5A3C;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.sign-in-button:hover {
  background-color: #8B5A3C;
  color: white;
  transform: translateY(-2px);
}

.guest-details-form {
  background: #fdfdfd;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
