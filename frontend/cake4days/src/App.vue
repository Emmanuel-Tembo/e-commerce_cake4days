<template>
 <div>
    <Navbar />
    <router-view/>
    <CartSiderbar/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import CartSiderbar from './components/CartSiderbar.vue';


export default {
  components: {
    Navbar,
    CartSiderbar
  }
};
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

