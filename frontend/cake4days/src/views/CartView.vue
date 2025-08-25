<template>
  <NavComp />
  <div class="container-fluid">
    <div class="cart-page">
    <!-- Empty Cart State -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <img src="https://www.cakesforpets.fr/cdn/shop/files/CakeetDonutsAnniversaireroseboite.jpg?v=1745331300&width=360" 
            alt="Empty cart" class="empty-cart-image" />
      <h3>Your cart is empty!</h3>
      <p>Looks like you haven't added any tasty treats yet</p>
      <button @click="$router.push('/')" class="browse-btn">
        Browse Treats
      </button>
    </div>

    <!-- Cart with Items -->
    <div v-else class="cart-container">
      <div class="cart-items">
        <h2 class="cart-title">Your Cart <span>({{ cartItems.length }})</span></h2>
        
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image_url" :alt="item.name" class="item-image" />
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-type">{{ item.type }}</p>
            
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item.product_id)" class="qty-btn">−</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.product_id)" class="qty-btn">+</button>
            </div>
            
            <p class="item-price">R{{ (item.price * item.quantity).toFixed(2) }}</p>
            <button @click="removeFromCart(item.product_id)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>
        
        <div class="summary-row">
          <span>Subtotal</span>
          <span>R{{ cartTotal.toFixed(2) }}</span>
        </div>
        
        <div class="discount-section">
          <input 
            type="text" 
            placeholder="Discount code" 
            v-model="discountCode"
            class="discount-input"
          >
          <button @click="applyDiscount" class="apply-btn">Apply</button>
        </div>
        
        <!-- Message box for discount feedback -->
        <div v-if="discountMessage" :class="discountMessageClass" class="mt-2 p-3 rounded-lg text-sm">
            {{ discountMessage }}
        </div>

        <div class="summary-row total">
          <span>Total</span>
          <span>R{{ cartTotal.toFixed(2) }}</span>
        </div>
        
        <button class="checkout-btn" @click="$router.push('/payment/checkout')">Proceed to Checkout</button>
        
        <p class="continue-shopping" @click="$router.push('/')">
          ← Continue Shopping
        </p>
        
        <div class="trust-badges">
          <div class="badge">
            <i class="fas fa-truck"></i>
            <span>Fast Shipping</span>
          </div>
          <div class="badge">
            <i class="fas fa-lock"></i>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import NavComp from '@/components/NavComp.vue';
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

export default {
  components: {
    NavComp,
  },
  setup(){
    const cartStore = useCartStore();
    const { cartItems, subtotal } = storeToRefs(cartStore);

    const { increaseQuantity, decreaseQuantity, removeFromCart } = cartStore;

    const discountCode = ref('');
    const discountApplied = ref(false);
    const discountMessage = ref('');
    const discountMessageClass = ref('');

    const applyDiscount = () => {
        // Your discount logic here
        if (discountCode.value === 'PETLOVE20') {
            discountApplied.value = true;
            discountMessage.value = '20% discount applied!';
            discountMessageClass.value = 'bg-green-100 text-green-700 border border-green-400';
        } else {
            discountMessage.value = 'Invalid discount code';
            discountMessageClass.value = 'bg-red-100 text-red-700 border border-red-400';
        }
    };

    return {
        // Expose Pinia state and actions to the template
        cartItems,
        cartTotal: subtotal, // Use the subtotal getter as cartTotal
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,

        // Expose local state and methods
        discountCode,
        applyDiscount,
        discountApplied,
        discountMessage,
        discountMessageClass,
    };
  },
}
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem 0;
}

.empty-cart-image {
  max-width: 300px;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.empty-cart h3 {
  color: #d23c67;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}
  .modern-header {
    background-color: #f19bbd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 80;
    width: 100%;
    left: 0;
    right: auto;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
  }
  
  .logo-text {
    font-family: 'Pacifico', cursive;
    color: #d23c67;
    font-size: 2.2rem;
    margin-bottom: 0;
    letter-spacing: 2px;
  }
  
  .logo-tagline {
    font-size: 1.1rem;
    color: #333;
    font-weight: 400;
    margin-top: -8px;
    letter-spacing: 1px;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .search-container {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 25px;
    box-shadow: 0 2px 8px rgba(210, 60, 103, 0.08);
    padding: 4px 12px 4px 18px;
    margin-right: 10px;
  }
  
  .search-bar {
    border: none;
    outline: none;
    font-size: 1rem;
    background: transparent;
    padding: 8px 0;
    width: 180px;
  }
  
  .search-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 8px;
    color: #d23c67;
    transition: color 0.2s;
  }
  
  .search-btn:hover {
    color: #ff6b8b;
  }
  
  .header-icons {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .icon {
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(210, 60, 103, 0.08);
    padding: 8px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon:hover {
    box-shadow: 0 4px 16px rgba(210, 60, 103, 0.15);
  }
  
  .cart-badge {
      background: #d23c67;
      color: #fff;
      border-radius: 50%;
      padding: 2px 7px;
      font-size: 0.85rem;
      position: absolute;
      top: -6px;
      right: -6px;
      font-weight: bold;
      margin-bottom: 1.5rem;
  }

.browse-btn {
  background: #ff6b8b;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.browse-btn:hover {
  background: #d23c67;
  transform: translateY(-2px);
}

.cart-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.cart-items {
  flex: 1;
  min-width: 300px;
}

.cart-title {
  color: #d23c67;
  margin-bottom: 1.5rem;
}

.cart-title span {
  color: #666;
  font-size: 1rem;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
  border: 1px solid #ffe5ec;
}

.cart-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(210, 60, 103, 0.1);
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  color: #333;
  margin-bottom: 0.3rem;
}

.item-type {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.qty-btn:hover {
  background: #ffe5ec;
  border-color: #ff6b8b;
}

.quantity {
  min-width: 30px;
  text-align: center;
}

.item-price {
  font-weight: bold;
  color: #d23c67;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b8b;
  cursor: pointer;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #d23c67;
  text-decoration: underline;
}

.order-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 350px;
  border: 1px solid #ffe5ec;
}

.order-summary h2 {
  color: #d23c67;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #eee;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.1rem;
  border-bottom: none;
  margin-top: 1rem;
}

.free-shipping {
  color: #4CAF50;
}

.discount-section {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.discount-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.apply-btn {
  background: #333;
  color: white;
  border: none;
  padding: 0 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: #555;
}

.checkout-btn {
  width: 100%;
  background: #ff6b8b;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s;
}

.checkout-btn:hover {
  background: #d23c67;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 139, 0.3);
}

.continue-shopping {
  color: #666;
  text-align: center;
  margin-top: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #d23c67;
}

.trust-badges {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.8rem;
}

.badge i {
  color: #ff6b8b;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }
  
  .order-summary {
    max-width: 100%;
  }
}
</style>