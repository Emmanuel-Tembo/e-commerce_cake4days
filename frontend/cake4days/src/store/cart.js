import { defineStore } from 'pinia';
import axios from 'axios';

// Helper function to save the cart to local storage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

export const useCartStore = defineStore('cart', {
  state: () => {
    // 1. Load the cart from local storage on initialization
    const savedCart = localStorage.getItem('cartItems');
    return { 
      cartItems: savedCart ? JSON.parse(savedCart) : [],
      isCartOpen: false
    };
  },
  getters: {
    totalItems: (state) => state.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal(state) {
      return state.cartItems.reduce((acc, item) => {
        const itemPrice = item.price || 0;
        return acc + (itemPrice * item.quantity);
      }, 0);
    },
  },
  actions: {
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.product_id === product.product_id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
      // 2. Save the updated cart to local storage
      saveCartToLocalStorage(this.cartItems);
    },
    removeFromCart(Id) {
      this.cartItems = this.cartItems.filter(item => item.product_id !== Id);
      // 3. Save the updated cart to local storage
      saveCartToLocalStorage(this.cartItems);
    },
    increaseQuantity(Id) {
      const item = this.cartItems.find(item => item.product_id === Id);
      if (item) {
        item.quantity++;
        // 4. Save the updated cart to local storage
        saveCartToLocalStorage(this.cartItems);
      }
    },
    decreaseQuantity(Id) {
      const item = this.cartItems.find(item => item.product_id === Id);
      if (item && item.quantity > 1) {
        item.quantity--;
        // 5. Save the updated cart to local storage
        saveCartToLocalStorage(this.cartItems);
      } else if (item && item.quantity === 1) {
        this.removeFromCart(Id); // This will call saveCartToLocalStorage already
      }
    },
    $resetCart() {
      this.isCartOpen = false;
      this.cartItems = [];
      // 6. Clear the cart from local storage on reset
      localStorage.removeItem('cartItems');
    },
    async processPayment(payload) {
      try {
        const response = await axios.post('/api/payments/process', payload);
        console.log('Payment response:', response.data);
        if (response.data.success) {
          this.$resetCart(); // Clear the cart on successful payment
        }
        return response.data;
      } catch (error) {
        console.error('Payment processing failed:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || error.message };
      }
    }
  },
});