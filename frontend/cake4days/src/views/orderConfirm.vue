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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f7f6;
  font-family: 'Arial', sans-serif;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.check-icon {
  width: 80px;
  height: 80px;
  color: #4CAF50;
  stroke: #4CAF50;
  stroke-width: 3px;
  animation: scale-in 0.5s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.title {
  font-size: 2.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.order-details {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.order-number {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.back-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 2rem;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
