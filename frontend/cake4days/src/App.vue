<template>
    <navbar-comp/>
    <router-view/>
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
  margin-top: 60px;
}
</style>

