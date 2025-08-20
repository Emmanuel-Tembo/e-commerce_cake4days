import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    cartItems: [],
    isCartOpen: false
  }),
  getters: {
    totalItems: (state) => state.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal(state) {
      return state.cartItems.reduce((acc, item) => {
        // Use a conditional check to prevent errors with missing price data
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
      const existingItem = this.cartItems.find(item => item.product_id  === product.product_id );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(Id) {
      this.cartItems = this.cartItems.filter(item => item.product_id  !== Id);
    },
    increaseQuantity(Id) {
      const item = this.cartItems.find(item => item.product_id  === Id);
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity(Id) {
      const item = this.cartItems.find(item => item.product_id === Id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else if (item && item.quantity === 1) {
          this.removeFromCart(Id);
        }
      },
      $resetCart() {
        this.isCartOpen = false;
        this.cartItems = [];
    }
  },
});