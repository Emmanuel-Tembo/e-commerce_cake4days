<template>
  <div class="hero-image-container">
    <img src="/path/to/your/cake-image.jpg" alt="Beautiful Custom Cake" class="hero-image">
  </div>
</template>

<script>
export default {
  name: 'HeroImage'
};
</script>

<style scoped>
.hero-image-container {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>