<template>
  <div class="product-management-container p-6">
    <header class="top-header flex justify-between items-center mb-6">
      <div class="search-bar">
        <input type="text" placeholder="SEARCHBAR" class="rounded-lg p-2 border border-gray-300 shadow-sm" />
      </div>
      <h1 class="text-3xl font-bold text-gray-800">PRODUCT MANAGEMENT</h1>
    </header>

    <div class="content-container bg-white p-6 rounded-xl shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Product List</h2>
        <button @click="showModal()" class="bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-green-600 transition-colors">
          Add New Product
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">Name</th>
              <th class="py-3 px-6 text-left">Price</th>
              <th class="py-3 px-6 text-left">Description</th>
              <th class="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-if="loading">
              <td colspan="4" class="py-3 px-6 text-center text-gray-500">
                Loading products...
              </td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="4" class="py-3 px-6 text-center text-gray-500">
                No products found. Add one to get started!
              </td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6">{{ product.name }}</td>
              <td class="py-3 px-6">${{ product.price.toFixed(2) }}</td>
              <td class="py-3 px-6">{{ product.description }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editProduct(product)" class="bg-blue-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-blue-600 transition-colors">Edit</button>
                <button @click="deleteProduct(product.id)" class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Add/Edit Product -->
    <div v-if="isModalVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-4">{{ modalTitle }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Product Name:</label>
            <input v-model="currentProduct.name" type="text" required class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Price ($):</label>
            <input v-model.number="currentProduct.price" type="number" step="0.01" required class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Description:</label>
            <textarea v-model="currentProduct.description" required rows="3" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="hideModal()" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-400">Cancel</button>
            <button type="submit" class="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// IMPORTANT: Replace with your Node.js backend URL
const API_URL = 'http://localhost:8081';

const products = ref([]);
const isModalVisible = ref(false);
const currentProduct = ref({});
const loading = ref(true);

const modalTitle = computed(() => {
  return currentProduct.value.id ? 'Edit Product' : 'Add New Product';
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${API_URL}/products`);
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const showModal = (product = null) => {
  if (product) {
    currentProduct.value = { ...product };
  } else {
    currentProduct.value = { id: null, name: '', price: 0, description: '' };
  }
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
};

const saveProduct = async () => {
  try {
    if (currentProduct.value.id) {
      await axios.put(`${API_URL}/products/${currentProduct.value.id}`, currentProduct.value);
    } else {
      await axios.post(`${API_URL}/products`, currentProduct.value);
    }
    await fetchProducts();
    hideModal();
  } catch (error) {
    console.error('Error saving product:', error);
  }
};

const editProduct = (product) => {
  showModal(product);
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Scoped styles to ensure they don't affect other components */
.product-management-container {
  min-height: 100vh;
  width: 100%;
}
</style>