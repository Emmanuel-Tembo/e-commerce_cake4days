<template>
  <div class="cake-about">
    <!-- Hero Banner with Cake Image -->
    <section class="hero-banner" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${images.hero})` }">
      <div class="hero-overlay">
        <h1>{{ shopName }}</h1>
        <p class="tagline">{{ tagline }}</p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="our-story">
      <div class="container">
        <div class="story-content">
          <h2>Our Sweet Story</h2>
          <div class="story-text">
            <p v-for="(para, index) in storyParagraphs" :key="index">{{ para }}</p>
          </div>
          <div class="signature">
            <img :src="images.signature" alt="Founder's signature">
            <p>{{ founderName }}, Founder</p>
          </div>
        </div>
        <div class="story-image">
          <img :src="images.founder" alt="Our founder with first cake">
        </div>
      </div>
    </section>

    <!-- Our Philosophy -->
    <section class="philosophy">
      <div class="container">
        <h2>Our Baking Philosophy</h2>
        <div class="philosophy-grid">
          <div v-for="item in philosophyItems" :key="item.title" class="philosophy-card">
            <div class="icon-wrapper">
              <i :class="item.icon"></i>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Meet the Bakers -->
    <section class="our-team">
      <div class="container">
        <h2>Meet Our Bakers</h2>
        <p class="team-intro">Our talented team of pastry chefs and decorators</p>
        <div class="team-grid">
          <div v-for="member in teamMembers" :key="member.id" class="team-member">
            <div class="member-image">
              <img :src="member.image" :alt="member.name">
              <div class="social-links">
                <a v-for="link in member.socialLinks" :key="link.platform" :href="link.url">
                  <i :class="link.icon"></i>
                </a>
              </div>
            </div>
            <h3>{{ member.name }}</h3>
            <p class="position">{{ member.position }}</p>
            <p class="bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="container">
        <h2>Sweet Words From Our Customers</h2>
        <div class="testimonial-slider">
          <div v-for="(testimonial, index) in testimonials" 
               :key="index" 
               class="testimonial-card"
               :class="{ active: activeTestimonial === index }">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <p class="quote">{{ testimonial.quote }}</p>
            <div class="customer">
              <img :src="testimonial.image" :alt="testimonial.name" class="customer-image">
              <div class="customer-info">
                <p class="name">{{ testimonial.name }}</p>
                <p class="event">{{ testimonial.event }}</p>
              </div>
            </div>
          </div>
          <div class="slider-controls">
            <button @click="prevTestimonial" class="slider-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="dots">
              <span v-for="(t, index) in testimonials" 
                    :key="index" 
                    @click="activeTestimonial = index"
                    :class="{ active: activeTestimonial === index }"></span>
            </div>
            <button @click="nextTestimonial" class="slider-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Visit Us -->
    <section class="visit-us">
      <div class="container">
        <div class="visit-content">
          <h2>Visit Our Bakery</h2>
          <p>{{ visitDescription }}</p>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>{{ address }}</p>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <p>{{ phone }}</p>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p>{{ email }}</p>
          </div>
          <button @click="navigateToContact" class="cta-button">Book a Consultation</button>
        </div>
        <div class="map-wrapper">
          <img :src="images.map" alt="Our bakery location" class="map-image">
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Image URLs (using placeholder images from Unsplash)
const images = {
  hero: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80',
  signature: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80',
  founder: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  map: 'https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=14&size=600x400&maptype=roadmap&markers=color:red%7C40.7128,-74.0060&key=YOUR_API_KEY',
  emily: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  carlos: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  sophie: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
  couple1: 'https://images.unsplash.com/photo-1529632316986-85a028b9a8a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  mom: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
  blogger: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
}

// Shop information
const shopName = ref("Sugar & Spice Cake Boutique")
const tagline = ref("Handcrafted cakes made with love since 2010")
const founderName = ref("Emily Wilson")
const address = ref("123 Sweet Street, Dessertville, CA 90210")
const phone = ref("(555) 123-4567")
const email = ref("hello@sugarspice.com")
const visitDescription = ref("Come visit our cozy bakery where the magic happens! Smell the fresh-baked goods, see our cake displays, and meet our team. We'd love to discuss your next special occasion cake.")

// Story content
const storyParagraphs = ref([
  "What began as a home baking passion project in 2010 has blossomed into Sugar & Spice Cake Boutique, a beloved local bakery known for our creative designs and delicious flavors.",
  "Our founder Emily started decorating cakes for friends' birthdays while working as a school teacher. Word spread about her talent, and after countless requests, she took the leap to open her own shop.",
  "Today, we're proud to have served over 5,000 happy customers and created cakes for weddings, birthdays, anniversaries, and all of life's sweet celebrations."
])

// Philosophy items
const philosophyItems = ref([
  {
    title: "Quality Ingredients",
    description: "We source only the finest local and organic ingredients for superior taste and texture.",
    icon: "fas fa-seedling"
  },
  {
    title: "Artistic Flair",
    description: "Each cake is a unique edible work of art, customized to your vision.",
    icon: "fas fa-palette"
  },
  {
    title: "Traditional Techniques",
    description: "We honor time-tested baking methods combined with modern innovation.",
    icon: "fas fa-mortar-pestle"
  },
  {
    title: "Sweet Memories",
    description: "Our goal is to create centerpieces that make your special moments unforgettable.",
    icon: "fas fa-heart"
  }
])

// Team members
const teamMembers = ref([
  {
    id: 1,
    name: "Emily Wilson",
    position: "Head Baker & Owner",
    bio: "With 15 years of baking experience, Emily specializes in intricate sugar flowers and vintage designs.",
    image: images.emily,
    socialLinks: [
      { platform: "instagram", url: "#", icon: "fab fa-instagram" },
      { platform: "pinterest", url: "#", icon: "fab fa-pinterest" }
    ]
  },
  {
    id: 2,
    name: "Carlos Mendez",
    position: "Pastry Chef",
    bio: "Trained in Paris, Carlos brings French techniques to our cake recipes and fillings.",
    image: images.carlos,
    socialLinks: [
      { platform: "instagram", url: "#", icon: "fab fa-instagram" }
    ]
  },
  {
    id: 3,
    name: "Sophie Chen",
    position: "Cake Decorator",
    bio: "Our resident artist who can recreate anything in cake form with stunning detail.",
    image: images.sophie,
    socialLinks: [
      { platform: "instagram", url: "#", icon: "fab fa-instagram" },
      { platform: "youtube", url: "#", icon: "fab fa-youtube" }
    ]
  }
])

// Testimonials
const testimonials = ref([
  {
    quote: "Our wedding cake was even more beautiful than we imagined! It tasted as good as it looked, and all our guests were raving about it.",
    name: "Jessica & Michael",
    event: "Wedding Cake, June 2023",
    image: images.couple1
  },
  {
    quote: "I order birthday cakes from Sugar & Spice every year for my daughter. They always come up with the most creative designs based on her current obsession!",
    name: "Sarah Thompson",
    event: "Birthday Cakes",
    image: images.mom
  },
  {
    quote: "As a food blogger, I've tried cakes from all over the city, and Sugar & Spice is hands-down the best. The texture is perfect every time!",
    name: "David Park",
    event: "Food Blogger",
    image: images.blogger
  }
])

const activeTestimonial = ref(0)
let testimonialInterval = null

const nextTestimonial = () => {
  activeTestimonial.value = (activeTestimonial.value + 1) % testimonials.value.length
}

const prevTestimonial = () => {
  activeTestimonial.value = (activeTestimonial.value - 1 + testimonials.value.length) % testimonials.value.length
}

onMounted(() => {
  testimonialInterval = setInterval(() => {
    nextTestimonial()
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(testimonialInterval)
})

const navigateToContact = () => {
  router.push('/contact')
}
</script>

<style scoped>
/* All the previous CSS styles remain exactly the same */
/* ... */
</style>