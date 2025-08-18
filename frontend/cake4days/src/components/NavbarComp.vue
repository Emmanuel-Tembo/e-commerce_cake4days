<template>
        <nav class="nav-bar d-flex justify-content-between">
        <router-link to="/about">About</router-link> |
        <router-link to="/merch">Merch</router-link> |
        <!-- <router-link to="/catalogue">Products</router-link> -->
        <router-link to="/cart">Cart</router-link>  |
        <router-link to="/catalogue">Catalogue</router-link>  |
         <!-- <router-link to="/merch">Merch</router-link>  | -->
        <router-link to="/PetTreats">PetTreats</router-link>  |
        <router-link to="/custom-order">Custom Order</router-link>
      </nav>
      
   
</template>
<style>
.navbar {
  padding: 20px;
  text-align: center;
}
 nav {
    padding: 30px;
  }
nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
}
nav-width {
  max-width: 1200px;
  margin:50 auto;
}
</style>