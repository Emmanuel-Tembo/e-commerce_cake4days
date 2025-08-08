<template>
  <div class="checkout-page max-w-5xl mx-auto p-8">
    <h1 class="text-3xl font-bold text-center mb-8">Checkout</h1>
    
    <div v-if="cartItems.length === 0" class="text-center text-gray-500">
      Your cart is empty!
      <router-link to="/custom-order" class="text-pink-600 hover:underline">
        Add some delicious treats.
      </router-link>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
        <div class="border rounded-lg p-4 bg-gray-50">
          <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center mb-2">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>R{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t mt-4 pt-4 flex justify-between font-bold text-xl">
            <span>Subtotal:</span>
            <span>R{{ subtotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-4">Customer Details</h2>
         <form @submit.prevent="submitOrder" class="order-form">
          <div class="form-section">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input type="text" id="fullName" v-model="formData.fullName" required />
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" v-model="formData.email" required />
            </div>
            </div>
          <button type="submit" class="w-full bg-pink-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-pink-700 mt-4">
            Place Your Order
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

export default {
  name: 'CheckoutPage',
  setup() {
    const cartStore = useCartStore();
    const { cartItems, subtotal } = storeToRefs(cartStore);

    const formData = ref({
      fullName: '',
      email: '',
    });

    const submitOrder = () => {
      // In a real application, you would send this data to a backend server.
      // For now, we'll log it to the console and clear the cart.
      console.log('Order Submitted!', {
        customer: formData.value,
        cart: cartItems.value,
        total: subtotal.value,
      });

      // Clear the cart after a successful order
      cartStore.$reset();
      
      // Optionally, redirect the user to a success page
      // router.push('/order-success');
    };

    return {
      cartItems,
      subtotal,
      formData,
      submitOrder
    };
  }
};
</script>

<style scoped>
/* You can add your form-related styles here */
.form-group {
    margin-bottom: 1rem;
}
label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}
input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}
</style>