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

        <!-- NEW: Address Management Section -->
        <div class="address-section">
          <h4>Shipping Addresses</h4>
          <!-- List of Addresses -->
          <div v-if="!showAddressForm" class="address-list">
            <div v-if="userAddresses.length === 0" class="empty-state">
              <p>No addresses found.</p>
            </div>
            <div v-else>
              <div v-for="address in userAddresses" :key="address.address_id" class="address-card">
                <p>
                  {{ address.street_address }}, {{ address.city }}, {{ address.state }}
                  {{ address.zip_code }}
                </p>
                <p>{{ address.country }}</p>
                <span v-if="address.is_default" class="default-badge">Default</span>
                <div class="address-actions">
                  <button @click="editAddress(address)" class="action-btn edit-btn">Edit</button>
                  <button @click="deleteAddress(address.address_id)" class="action-btn delete-btn">Delete</button>
                </div>
              </div>
            </div>
            <button @click="showAddressForm = true" class="add-address-btn">Add New Address</button>
          </div>

          <!-- Add/Edit Address Form -->
          <form v-else @submit.prevent="saveAddress" class="address-form">
            <input v-model="formAddress.street_address" placeholder="Street Address" required />
            <input v-model="formAddress.city" placeholder="City" required />
            <input v-model="formAddress.state" placeholder="State" required />
            <input v-model="formAddress.zip_code" placeholder="Zip Code" required />
            <input v-model="formAddress.country" placeholder="Country" required />
            <label class="default-label">
              <input type="checkbox" v-model="formAddress.is_default" />
              Set as default
            </label>
            <div class="form-actions">
              <button type="submit" class="submit-btn">{{ editingAddress ? 'Update' : 'Add' }} Address</button>
              <button type="button" @click="cancelEdit" class="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
        <!-- END: Address Management Section -->

        <button @click="handleLogout" class="logout-btn">Log Out</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore, mapState } from 'vuex';
import { ref, watch, computed } from 'vue';

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
  setup(props, { emit }) {
    const store = useStore();
    
    // NEW: Local state for address management
    const showAddressForm = ref(false);
    const editingAddress = ref(null);
    const formAddress = ref({
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      is_default: false,
    });

    // NEW: Computed property to get addresses from the store
    const userAddresses = computed(() => store.state.userAddresses);

    // Watch for changes in modal visibility to fetch addresses
    watch(() => props.isVisible, (newVal) => {
      if (newVal) {
        store.dispatch('fetchUserAddresses');
      }
    });

    const closeModal = () => {
      // Reset form state when modal closes
      cancelEdit();
      emit('close-modal');
    };

    const handleLogout = async () => {
      await store.dispatch('logout');
      closeModal();
    };

    // NEW: Methods for Address CRUD
    const editAddress = (address) => {
      editingAddress.value = address;
      formAddress.value = { ...address }; // Populate form with existing data
      showAddressForm.value = true;
    };

    const deleteAddress = async (addressId) => {
      if (confirm('Are you sure you want to delete this address?')) {
        try {
          await store.dispatch('deleteUserAddress', addressId);
          console.log('Address deleted successfully!');
        } catch (e) {
          console.error('Failed to delete address:', e);
        }
      }
    };

    const saveAddress = async () => {
      try {
        if (editingAddress.value) {
          // Update existing address
          await store.dispatch('updateUserAddress', {
            addressId: editingAddress.value.address_id,
            addressData: formAddress.value,
          });
        } else {
          // Add new address
          await store.dispatch('addUserAddress', formAddress.value);
        }
        
        console.log('Address saved successfully!');
        cancelEdit(); // Reset form and hide it
        await store.dispatch('fetchUserAddresses'); // Re-fetch addresses to update the list
      } catch (e) {
        console.error('Failed to save address:', e);
      }
    };

    const cancelEdit = () => {
      showAddressForm.value = false;
      editingAddress.value = null;
      formAddress.value = {
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        is_default: false,
      };
    };

    return {
      closeModal,
      handleLogout,
      userAddresses,
      showAddressForm,
      editingAddress,
      formAddress,
      editAddress,
      deleteAddress,
      saveAddress,
      cancelEdit
    };
  },
};
</script>

<style scoped>
/* ==================================== */
/* Modal Backdrop and Structure */
/* ==================================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: flex-end; /* Align to the right for the slide-in effect */
  align-items: center;
  backdrop-filter: blur(5px);
  /* Keep your existing slide-right animation classes */
}

.modal-content {
  background-color: #fff;
  border-radius: 15px 0 0 15px; /* Rounded corners on the left side only */
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2); /* Shadow on the left to emphasize the slide */
  width: 90%;
  max-width: 500px; /* Make it a bit narrower for a sleeker look */
  height: 100vh; /* Make it full height */
  padding: 40px 30px; /* Add more vertical padding */
  overflow-y: auto;
  transform: translateX(0); /* Default position */
  transition: transform 0.3s ease-out;
  position: relative;
}

/* Ensure the modal is off-screen before it slides in */
.slide-right-enter-from .modal-content,
.slide-right-leave-to .modal-content {
  transform: translateX(100%);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: #8b5a3c;
  cursor: pointer;
  transition: transform 0.2s ease;
  font-weight: 300; /* Lighter font weight for a clean look */
}

.close-btn:hover {
  transform: rotate(90deg);
}

/* ==================================== */
/* Profile Details and Headers */
/* ==================================== */
.profile-details {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.profile-details h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: #8b5a3c;
  margin-bottom: 5px;
}

.profile-details p {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: #555;
  margin: 0;
}

.address-section h4 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #a0522d;
  margin-top: 30px;
  margin-bottom: 15px;
}

/* ==================================== */
/* Address List and Cards */
/* ==================================== */
.address-list {
  margin-top: 15px;
}

.address-card {
  background-color: #fcf8f5; /* A subtle, creamy background */
  border: 1px solid #f0e0d6;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  position: relative;
  transition: box-shadow 0.3s ease;
}

.address-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.address-card p {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #333;
}

.default-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #cd853f;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.address-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.edit-btn {
  color: #8b5a3c;
}

.edit-btn:hover {
  color: #cd853f;
}

.delete-btn {
  color: #a0522d;
}

.delete-btn:hover {
  color: #dc3545;
}

/* ==================================== */
/* Address Form */
/* ==================================== */
.address-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 25px;
}

.address-form input {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.address-form input:focus {
  outline: none;
  border-color: #8b5a3c;
  box-shadow: 0 0 0 3px rgba(139, 90, 60, 0.2);
}

.default-label {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #555;
}

.default-label input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.submit-btn,
.cancel-btn {
  font-family: 'Poppins', sans-serif;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #8b5a3c;
  color: white;
}

.submit-btn:hover {
  background-color: #a0522d;
}

.cancel-btn {
  background-color: #e9ecef;
  color: #495057;
}

.cancel-btn:hover {
  background-color: #ced4da;
}

/* ==================================== */
/* Logout and Buttons */
/* ==================================== */
.logout-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c82333;
}

.empty-state {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  color: #888;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.add-address-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #8b5a3c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.add-address-btn:hover {
  background-color: #a0522d;
}
</style>
