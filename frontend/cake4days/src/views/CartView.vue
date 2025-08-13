<template>
  <div class="cart-container">
    <h1>Your Shopping Cart</h1>
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th></th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>
            <img :src="item.imageUrl" alt="" class="cart-img" />
          </td>
          <td>
            <div class="cart-product-info">
              <div>{{ item.name }}</div>
              
            </div>
          </td>
          <td>R{{ item.price.toFixed(2) }}</td>
            <td>
            <div class="qty-controls">
              <button @click="decrement(item)" :disabled="item.quantity <= 1">-</button>
              <input type="text" :value="item.quantity" readonly />
              <button @click="increment(item)">+</button>
            </div>
          </td>
          <td>R{{ (item.price * item.quantity).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <button>CHECK OUT</button>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: "Pink phone case",
          imageUrl: "https://img.kwcdn.com/product/fancy/e1f2b3fc-805c-49db-8669-6afbebc5ddb2.jpg?imageView2/2/w/800/q/70/format/webp",
          price: 40.99,
          quantity: 1
        },
        {
          id: 2,
          name: "Minnie Mouse phone case",
          imageUrl: "https://img.kwcdn.com/product/open/74218433ad654dc2902cb2b9e6445fc4-goods.jpeg?imageView2/2/w/800/q/70/format/webp",
          price: 45.00,
          quantity: 1
        },
        {
          id: 3,
          name: "Heart phone case",
          imageUrl: "https://img.kwcdn.com/product/fancy/1c003e15-b967-4a2d-a24b-4029d662e760.jpg?imageView2/2/w/800/q/70/format/webp",
          price: 29.95,
          quantity: 1
        }
      ]
    };
  },
  created() {
  const query = this.$route.query;

  if (query.id) {
    this.cartItems = [
      {
        id: parseInt(query.id),
        name: query.name,
        price: parseFloat(query.price),
        quantity: parseInt(query.quantity),
        imageUrl: query.imageUrl
      }
    ];
}
    },
    

  methods: {
    increment(item) {
      item.quantity++;
    },
    decrement(item) {
      if (item.quantity > 1) item.quantity--;
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    }
  }
};
</script>

<style scoped>
.cart-container {
  background: #f5bbe2;
  border: 1px solid #5e0202;
  border-radius: 20px;
  padding: 32px;
  margin: 24px auto;
  max-width: 900px;
}
h1 {
  text-align: center;
  font-weight: 400;
  margin-bottom: 32px;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: #faf8f4;
}
.cart-table th,
.cart-table td {
  padding: 16px 8px;
  text-align: left;
  font-size: 1rem;
}
.cart-table th {
  border-bottom: 2px solid #ccc;
  font-weight: 400;
}
.cart-table tbody tr {
  border-bottom: 2px solid #ccc;
}
.cart-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #eee;
}
.cart-product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cart-icon{
  position: relative;

}
.cart-count{
  position: absolute;
  top: -6px;
  right: -6px;
  background: #FF4136;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75em;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.qty-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.qty-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #222;
  background: #fff;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 4px;
}
.qty-controls input {
  width: 32px;
  text-align: center;
  border: none;
  background: #fff;
  font-size: 1em;
}

</style>