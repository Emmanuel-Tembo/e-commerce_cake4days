<template>
 <div id="app">
    <Navbar />
    <router-view/>
    <CartSidebar/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import CartSidebar from './components/CartSidebar.vue';


export default {
  components: {
    Navbar,
    CartSidebar
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

