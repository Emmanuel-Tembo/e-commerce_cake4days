import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    isCartOpen: false,
    cartItems: [],
  }),
  getters: {
    totalItems: (state) => state.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: (state) => state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
  },
  actions: {
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(Id) {
      this.cartItems = this.cartItems.filter(item => item.id !== Id);
    },
    increaseQuantity(Id) {
      const item = this.cartItems.find(item => item.id === Id);
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity(Id) {
      const item = this.cartItems.find(item => item.id === Id);
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