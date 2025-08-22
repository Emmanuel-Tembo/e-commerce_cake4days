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
    async submitOrderAndPay(payload) {
            try {
                // The backend call now sends the complete payload.
                const response = await axios.post('/api/orders', payload);
                
                // If the backend call is successful, clear the frontend cart
                if (response.status === 201) {
                    this.$resetCart(); 
                    return { success: true, message: 'Order created and paid successfully!', orderNumber: response.data.orderNumber };
                }

                return response.data;
            } catch (error) {
                console.error('Order submission failed:', error.response?.data?.message || error.message);
                // Return an object indicating failure.
                return { success: false, message: error.response?.data?.message || error.message };
            }
        }
    },
});