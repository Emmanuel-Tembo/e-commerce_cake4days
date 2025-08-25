// OrderConfirmation.vue
<template>
  <div class="confirmation-container">
    <div class="card">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-8.82"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h1 class="title">Thank You for Your Order!</h1>
      <p class="message">Your order has been placed successfully. An email confirmation has been sent to your email address.</p>
      
      <div class="order-details">
        <h2 class="order-number">Order Number: {{ orderNumber }}</h2>
      </div>

      <button @click="goToHome" class="back-button">Back to Home</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'OrderConfirmation',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orderNumber = ref('');

    onMounted(() => {
      // Get the order number from the URL query parameters
      orderNumber.value = route.query.orderNumber || 'N/A';
    });

    const goToHome = () => {
      // Redirect the user back to the home page
      router.push('/');
    };

    return {
      orderNumber,
      goToHome,
    };
  },
};
</script>

<style scoped>
.confirmation-container {
    font-family: 'Poppins', sans-serif;
    background-color: #f5f2e8; /* Soft, warm beige background */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    color: #333;
}

.card {
    background-color: #fff;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: center;
    max-width: 500px;
    width: 100%;
    border: 1px solid #795548; /* Brown outline */
}

.icon-container {
    background-color: #c2b280; /* Beige color for the circle */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 20px;
}

.check-icon {
    color: #fff; /* White checkmark */
    width: 40px;
    height: 40px;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    color: #795548; /* Brown heading */
    margin-bottom: 10px;
}

.message {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 30px;
}

.order-details {
    background-color: #f8f3eb; /* Lighter beige for details section */
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    border: 1px solid #ddd;
}

.order-number {
    font-size: 1.25rem;
    font-weight: 600;
    color: #4b352a; /* Darker brown */
}

.back-button {
    background-color: #c2b280; /* Beige button */
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #795548; /* Brown hover */
}
</style>