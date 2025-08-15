<template>
  <transition name="slide-right">
    <div v-if="isVisible" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <div v-if="userData" class="profile-details">
          <h3>Welcome, {{ userData.username }}</h3>
          <p>Email: {{ userData.email }}</p>
          <p>Role: {{ userData.role }}</p>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    userData: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style scoped>
/* Modal backdrop styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end; /* Pushes the modal to the right */
  align-items: center;
  z-index: 1000;
}

/* Modal content styles */
.modal-content {
  background: white;
  padding: 30px;
  width: 350px;
  height: 100%;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Slide-in transition styles */
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.5s ease;
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>