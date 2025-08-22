<template>
  <div class="payment-page">
    <div class="container mx-auto p-8 rounded-xl shadow-lg bg-white">
      <h1 class="page-title text-3xl font-bold text-center text-pink-600 mb-6">Finalizing Your Order</h1>
      <p class="subtitle text-gray-600 mb-4 text-center">Just a few more steps to make your cake dreams a reality.</p>

      <!-- Checkout Prompt: Sign In vs. Guest -->
      <div v-if="checkoutStage === 'prompt'" class="checkout-prompt">
        <h2 class="text-2xl font-semibold text-center mb-4">How would you like to check out?</h2>
        <div class="prompt-buttons flex justify-center space-x-4">
          <button @click="startGuestCheckout" class="guest-button px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform active:scale-95 shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-pink-300">
            Continue as Guest
          </button>
          <button @click="handleSignIn" class="sign-in-button px-6 py-3 rounded-full text-pink-500 font-bold border-2 border-pink-500 transition-all duration-300 transform active:scale-95 shadow-lg hover:bg-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-300">
            Sign In
          </button>
        </div>
      </div>

      <!-- Guest Details Form & Saved Address Display -->
      <div v-else-if="checkoutStage === 'guest_details'" class="guest-details-form">
        <h2 class="text-2xl font-semibold mb-4">
          <span v-if="authenticatedUser && hasSavedAddress">Confirm Your Shipping Details</span>
          <span v-else>Enter Your Shipping Details</span>
        </h2>
        <!-- New: Display saved address if available -->
        <div v-if="authenticatedUser && userProfile.addresses && userProfile.addresses.length > 0" class="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p class="text-sm text-gray-800 font-medium">Using saved address:</p>
          <p class="text-sm text-gray-600">{{ userProfile.addresses[0].street_address }}, {{ userProfile.addresses[0].city }}</p>
          <p class="text-sm text-gray-600">{{ userProfile.addresses[0].state }}, {{ userProfile.addresses[0].zip_code }}</p>
          <p class="text-sm text-gray-600">{{ userProfile.addresses[0].country }}</p>
          <p class="text-sm text-gray-600">
            <input type="checkbox" id="useSavedAddress" v-model="useSavedAddress" />
            <label for="useSavedAddress" class="ml-2">Use this saved address</label>
          </p>
        </div>

        <form @submit.prevent="continueToPayment" class="space-y-4">
          <div v-if="!useSavedAddress || !authenticatedUser" class="space-y-4">
            <div class="form-group">
              <label for="fullName" class="block text-gray-700 font-medium mb-1">Full Name</label>
              <input type="text" id="fullName" v-model="formData.fullName" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
            </div>
            <div class="form-group">
              <label for="email" class="block text-gray-700 font-medium mb-1">Email Address</label>
              <input type="email" id="email" v-model="formData.email" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
            </div>
            <div class="form-group">
              <label for="phoneNumber" class="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input type="tel" id="phoneNumber" v-model="formData.phoneNumber" class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
            </div>
            <div class="form-group">
              <label for="street" class="block text-gray-700 font-medium mb-1">Street Address</label>
              <input type="text" id="street" v-model="formData.shippingAddress.street" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="city" class="block text-gray-700 font-medium mb-1">City</label>
                <input type="text" id="city" v-model="formData.shippingAddress.city" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>
              <div class="form-group">
                <label for="state" class="block text-gray-700 font-medium mb-1">State</label>
                <input type="text" id="state" v-model="formData.shippingAddress.state" class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="zipCode" class="block text-gray-700 font-medium mb-1">Zip Code</label>
                <input type="text" id="zipCode" v-model="formData.shippingAddress.zipCode" class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>
              <div class="form-group">
                <label for="country" class="block text-gray-700 font-medium mb-1">Country</label>
                <input type="text" id="country" v-model="formData.shippingAddress.country" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>
            </div>
          </div>
          <button type="submit" class="submit-button w-full px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform active:scale-95 shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-pink-300">
            Continue to Payment
          </button>
        </form>
      </div>

      <!-- Payment Section -->
      <div v-else-if="checkoutStage === 'payment'" class="payment-grid grid md:grid-cols-2 gap-8">
        <!-- Order Summary Section -->
        <div class="summary-section p-6 rounded-xl border border-gray-200">
          <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
          <div class="summary-details space-y-2">
            <div class="summary-item flex justify-between items-center" v-for="item in cartStore.cartItems" :key="item.product_id">
              <span class="text-gray-600">{{ item.name }} (x{{ item.quantity }})</span>
              <span class="font-semibold text-gray-800">R{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="summary-item subtotal flex justify-between items-center border-t border-gray-200 pt-2">
              <span class="text-gray-600 font-medium">Subtotal:</span>
              <span class="font-semibold text-gray-800">R{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item flex justify-between items-center">
              <span class="text-gray-600 font-medium">Shipping:</span>
              <span class="font-semibold text-gray-800">R{{ shipping.toFixed(2) }}</span>
            </div>
            <div class="summary-item total flex justify-between items-center border-t-2 border-pink-500 pt-2 font-bold text-lg">
              <span>Total:</span>
              <span>R{{ total.toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-details mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">Your Details</h3>
            <p class="text-sm text-gray-600"><strong>Name:</strong> {{ formData.fullName }}</p>
            <p class="text-sm text-gray-600"><strong>Email:</strong> {{ formData.email }}</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">Shipping To</h3>
            <p class="text-sm text-gray-600">{{ formData.shippingAddress.street }}, {{ formData.shippingAddress.city }}</p>
            <p class="text-sm text-gray-600">{{ formData.shippingAddress.state }}, {{ formData.shippingAddress.zipCode }}</p>
            <p class="text-sm text-gray-600">{{ formData.shippingAddress.country }}</p>
          </div>
        </div>

        <!-- Payment Form Section -->
        <div class="form-section p-6 rounded-xl border border-gray-200">
          <h2 class="text-2xl font-semibold mb-4">Payment Details</h2>
          
          <div class="payment-tabs flex space-x-2 mb-4">
            <button 
              :class="{ 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200': true, 'bg-pink-500 text-white': activePaymentMethod === 'card', 'bg-gray-200 text-gray-700': activePaymentMethod !== 'card' }"
              @click="setActiveMethod('card')">
              Credit Card
            </button>
            <button 
              :class="{ 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200': true, 'bg-pink-500 text-white': activePaymentMethod === 'paypal', 'bg-gray-200 text-gray-700': activePaymentMethod !== 'paypal' }"
              @click="setActiveMethod('paypal')">
              PayPal
            </button>
          </div>
          
          <div v-if="activePaymentMethod === 'card'" class="payment-form-container">
            <form @submit.prevent="submitPayment" class="space-y-4">
              <div class="form-group">
                <label for="cardNumber" class="block text-gray-700 font-medium mb-1">Card Number</label>
                <input type="text" id="cardNumber" v-model="paymentData.cardNumber" placeholder="•••• •••• •••• ••••" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="expDate" class="block text-gray-700 font-medium mb-1">Expiration Date</label>
                  <input type="text" id="expDate" v-model="paymentData.expDate" placeholder="MM / YY" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
                </div>
                <div class="form-group">
                  <label for="cvv" class="block text-gray-700 font-medium mb-1">CVV</label>
                  <input type="text" id="cvv" v-model="paymentData.cvv" placeholder="•••" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
                </div>
              </div>

              <div class="form-group">
                <label for="cardHolderName" class="block text-gray-700 font-medium mb-1">Cardholder Name</label>
                <input type="text" id="cardHolderName" v-model="paymentData.cardHolderName" required class="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500" />
              </div>

              <button 
                type="submit" 
                :disabled="isProcessing"
                class="submit-button w-full px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform active:scale-95 shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-pink-300">
                {{ isProcessing ? 'Processing...' : 'Pay with Card' }}
              </button>
            </form>
          </div>

          <div v-else-if="activePaymentMethod === 'paypal'" class="payment-form-container paypal-container">
            <p class="text-center text-gray-600">This method is in development</p>
            <button @click="submitPayment" :disabled="isProcessing" class="submit-button w-full px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform active:scale-95 shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-pink-300">
              {{ isProcessing ? 'Processing...' : 'Coming soon...' }}
            </button>
          </div>
          
          <!-- Message box for user feedback -->
          <div v-if="message" :class="messageClass" class="mt-6 p-4 rounded-lg font-medium transition-all duration-300">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'PaymentPage',
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();
    const store = useStore();
    const checkoutStage = ref('prompt'); // 'prompt', 'guest_details', or 'payment'
    const activePaymentMethod = ref('creditCard');

    // Reactive variables for error handling and UI feedback
    const isProcessing = ref(false);
    const message = ref('');
    const messageClass = ref('');
    const useSavedAddress = ref(false);
    const userAddresses = computed(() => store.state.userAddresses); 

    const formData = ref({
      fullName: '',
      email: '',
      phoneNumber: '',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    });

    const paymentData = ref({
      cardNumber: '',
      expDate: '',
      cvv: '',
      cardHolderName: '',
    });

    const shipping = computed(() => {
      // Free shipping for orders over R500, otherwise R75
      return cartStore.subtotal > 500 ? 50.00 : 75.00;
    });

    const total = computed(() => {
      return cartStore.subtotal + shipping.value;
    });

    // Computed properties from Vuex store
    const authenticatedUser = computed(() => store.state.isAuthenticated);
    const userProfile = computed(() => store.state.user);
    const hasSavedAddress = ref(false);

    // Initial setup on component mount
    onMounted(async () => {
    // Wait for auth status to be confirmed
    await store.dispatch('checkAuth');
    
    // Check if the user is authenticated and the user profile has been fetched
    if (authenticatedUser.value && userProfile.value) {
        // Fetch addresses for the user profile
        await store.dispatch('fetchUserAddresses');

        if (userAddresses.value && userAddresses.value.length > 0) {
            const defaultAddress = userAddresses.value[0];
            
            // Populate form data with the user's details
            // The user object now contains the addresses
            formData.value.fullName = userProfile.value.username;
            formData.value.email = userProfile.value.email;

            // Populate shipping address details for display purposes
            formData.value.shippingAddress.street = defaultAddress.street_address || '';
            formData.value.shippingAddress.city = defaultAddress.city || '';
            formData.value.shippingAddress.state = defaultAddress.state || '';
            formData.value.shippingAddress.zipCode = defaultAddress.zip_code || '';
            formData.value.shippingAddress.country = defaultAddress.country || '';

            // Set flags and move directly to the payment stage
            hasSavedAddress.value = true;
            useSavedAddress.value = true;
            checkoutStage.value = 'payment';
        } else {
            // No saved address, but user is authenticated.
            // Pre-populate with user details and stay on the details form.
            formData.value.fullName = userProfile.value.username;
            formData.value.email = userProfile.value.email;
            formData.value.phoneNumber = userProfile.value.phone_number || '';
            checkoutStage.value = 'guest_details';
            hasSavedAddress.value = false;
        }
    } else {
        // User is not authenticated, show the initial prompt
        checkoutStage.value = 'prompt';
        hasSavedAddress.value = false;
    }
});

    const setActiveMethod = (method) => {
      activePaymentMethod.value = method;
    };

    const startGuestCheckout = () => {
      checkoutStage.value = 'guest_details';
    };

    const continueToPayment = () => {
      // Basic validation check for the guest form
      if (useSavedAddress.value || (formData.value.fullName && formData.value.email && formData.value.shippingAddress.street)) {
        checkoutStage.value = 'payment';
        message.value = '';
      } else {
        message.value = 'Please fill in all required shipping details to continue.';
        messageClass.value = 'bg-yellow-100 text-yellow-700 border border-yellow-400';
      }
    };

    const handleSignIn = () => {
      console.log('Redirecting to sign-in page...');
      router.push('/sign');
    };

    // New function to validate credit card details
    const validateCreditCardForm = () => {
      const { cardNumber, expDate, cvv, cardHolderName } = paymentData.value;
      
      // Card Number validation (16 digits)
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        message.value = 'Please enter a valid 16-digit card number.';
        return false;
      }

      // Expiration Date validation (MM/YY format and future date)
      const [month, year] = expDate.split('/').map(s => s.trim());
      if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
        message.value = 'Please enter the expiration date in MM/YY format.';
        return false;
      }
      const fullYear = 2000 + parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
      if (fullYear < currentYear || (fullYear === currentYear && parseInt(month, 10) < currentMonth)) {
        message.value = 'This card has expired.';
        return false;
      }
      
      // CVV validation (3 or 4 digits)
      if (!/^\d{3,4}$/.test(cvv)) {
        message.value = 'Please enter a valid 3 or 4-digit CVV.';
        return false;
      }
      
      // Cardholder Name validation (not empty)
      if (!cardHolderName.trim()) {
        message.value = 'Please enter the cardholder name.';
        return false;
      }

      return true; // All validation passed
    };

    const submitPayment = async () => {
        message.value = '';
        messageClass.value = '';
        isProcessing.value = true;

        if (cartStore.cartItems.length === 0) {
            message.value = 'Your cart is empty. Please add products before checking out.';
            messageClass.value = 'bg-yellow-100 text-yellow-700 border border-yellow-400';
            isProcessing.value = false;
            return;
        }

        if (activePaymentMethod.value === 'card' && !validateCreditCardForm()) {
            messageClass.value = 'bg-yellow-100 text-yellow-700 border border-yellow-400';
            isProcessing.value = false;
            return;
        }

        let payload = {};
        let saveDetails = false;

        // let payload = {};

    if (authenticatedUser.value && useSavedAddress.value) {
        // If the user is logged in AND is using a saved address,
        // we only need to send the addressId and other basic details.
        const defaultAddressId = userAddresses.value[0].address_id;
         payload = {
            addressId: defaultAddressId,
            shippingDetails: {
                fullName: formData.value.fullName,
                email: formData.value.email,
                phoneNumber: formData.value.phoneNumber,
            },
            paymentDetails: {
                ...paymentData.value,
                method: activePaymentMethod.value,
            },
            cartItems: cartStore.cartItems,
            totalAmount: total.value,
            saveDetails: false, // No need to save a new address
        };
    } else {
        // Use this for both guests and authenticated users creating a new address
        payload = {
            shippingDetails: {
                fullName: formData.value.fullName,
                email: formData.value.email,
                phoneNumber: formData.value.phoneNumber,
                streetAddress: formData.value.shippingAddress.street,
                city: formData.value.shippingAddress.city,
                state: formData.value.shippingAddress.state,
                zipCode: formData.value.shippingAddress.zipCode,
                country: formData.value.shippingAddress.country,
            },
            paymentDetails: {
                ...paymentData.value,
                method: activePaymentMethod.value,
            },
            cartItems: cartStore.cartItems,
            totalAmount: total.value,
            saveDetails: authenticatedUser.value, // Save for logged-in users only
        };
    }
        // 💡 The fix is here: Add the paymentMethod to the payload.
        // const payload = {
        //     shippingDetails: shippingDetails,
        //     paymentDetails: {
        //         ...paymentData.value,
        //         method : activePaymentMethod.value // <-- This is the new line
        //     },
        //     cartItems: cartStore.cartItems,
        //     total: total.value,
        //     saveDetails: saveDetails,
        // };

        try {
            const result = await cartStore.submitOrderAndPay(payload);

            if (result.success) {
                message.value = `Payment successful! Order Number: ${result.orderNumber}`;
                messageClass.value = 'bg-green-100 text-green-700 border border-green-400';
                console.log(`Payment successful! Order Number: ${result.orderNumber}`);
                router.push({
                    path: '/order-confirmation',
                    query: { orderNumber: result.orderNumber },
                });
            } else {
                message.value = `Payment failed: ${result.message}`;
                messageClass.value = 'bg-red-100 text-red-700 border border-red-400';
                console.error(`Payment failed: ${result.message}`);
            }
        } catch (error) {
            message.value = `An unexpected error occurred during payment. Please try again.`;
            messageClass.value = 'bg-red-100 text-red-700 border border-red-400';
            console.error('An unexpected error occurred during payment.', error);
        } finally {
            isProcessing.value = false;
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
      userProfile,
      hasSavedAddress,
      isProcessing,
      message,
      messageClass,
      userAddresses, 
      useSavedAddress,
      setActiveMethod,
      startGuestCheckout,
      continueToPayment,
      handleSignIn,
      submitPayment,
    };
  },
};
</script>
<style scoped>
/* Scoped styles can be added here */
/* .payment-page {
  padding-top: 5rem;
  background-color: #f7fafc;
  min-height: 100vh;
} */
.page-title {
  font-family: 'Playfair Display', serif;
}
.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.badge {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 14px;
}
.badge i {
  color: #48bb78;
}

.payment-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fce4ec;
  font-family: 'Inter', sans-serif;
}



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
