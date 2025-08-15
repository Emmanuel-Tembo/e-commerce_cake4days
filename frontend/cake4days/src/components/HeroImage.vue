<template>
  <div class="hero-image-container rounded d-flex justify-content-center">
  <img src="https://www.foodandwine.com/thmb/cUck29eCdcIEjx_r5Q5ReugKoNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Fraiser-cake-FT-RECIPES0624-e9972b38ccb54d3ca8edbbb9a5bb1642.jpeg" alt="Beautiful Custom Cake" class="hero-image">
  </div>
</template>

<script>
export default {
  name: 'HeroImage'
};
</script>

<style scoped>
.hero-image-container {
  width: 90%;
  max-height: 400px;
  margin: auto;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>