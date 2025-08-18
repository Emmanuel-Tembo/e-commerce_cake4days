<template>
  <div class="hero-image-container">
    <img src="https://www.foodandwine.com/thmb/cUck29eCdcIEjx_r5Q5ReugKoNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Fraiser-cake-FT-RECIPES0624-e9972b38ccb54d3ca8edbbb9a5bb1642.jpeg" alt="Beautiful Custom Cake" class="hero-image">
    <div class="hero-overlay">
      <h1 class="page-title animated-title">Create Your Dream Cake</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroImage'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.hero-image-container {
  position: relative; /* Important for positioning the overlay */
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center; /* Vertically centers the text */
  justify-content: center; /* Horizontally centers the text */
}

.page-title {
  font-family: 'Poppins', sans-serif;
  color: white; /* Changed color for better visibility on the dark overlay */
  font-size: 5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Added for better readability */
  opacity: 0;
  transform: translateY(-20px);
}

.animated-title {
  animation: fadeInDown 1s ease-out 0.5s forwards; /* Added a small delay to the animation */
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>