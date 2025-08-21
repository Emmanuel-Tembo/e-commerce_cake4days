<template>
  <div id="app">
    <router-view/>
    <CartSidebar/>
    <ProfileModal
      :isVisible="isProfileModalOpen"
      :userData="currentUser"
      @close-modal="closeProfileModal"

    />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
// import Navbar from './components/Navbar.vue';
import CartSidebar from './components/CartSidebar.vue';
import ProfileModal from './components/ProfileModal.vue';


export default {
  components: {
    // Navbar,
    CartSidebar,
    ProfileModal
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch('checkAuth');
    });

    // Get the state from the Vuex store
    const isProfileModalOpen = computed(() => store.getters.isProfileModalOpen);
    const currentUser = computed(() => store.getters.currentUser);

    // Call the Vuex action to close the modal
    const closeProfileModal = () => {
      store.dispatch('toggleProfileModal', false);
    };

    return {
      isProfileModalOpen,
      currentUser,
      closeProfileModal,
    };
  },
};
</script>

<style>

#app {
    font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>

