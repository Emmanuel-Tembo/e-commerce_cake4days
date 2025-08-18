<template>
  <Navbar />
  <div class="flex min-h-screen bg-gray-100 font-sans">
    <!-- Mobile Sidebar Button -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg text-gray-700 bg-white shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
      class="transform transition-transform duration-300 ease-in-out md:translate-x-0 md:flex md:w-64 bg-white shadow-xl flex-col justify-between fixed h-full md:relative z-40 p-4"
    >
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-8">
          <span class="text-2xl font-bold text-gray-800">CAKES 4 DAYS</span>
        </div>
        <nav>
          <ul>
            <!-- Analytics -->
            <li class="mb-2">
              <a href="#" @click="setCurrentPage('analytics')" class="flex items-center p-3 rounded-xl text-white bg-indigo-500 shadow-md transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Analytics
              </a>
            </li>
            <!-- Product Management -->
            <li class="mb-2">
              <a href="#" @click="setCurrentPage('product-management')" class="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.485 9.168 5 7.5 5S4.168 5.485 3 6.253m9 0c1.168-.768 2.832-1.253 4.5-1.253s3.332.485 4.5 1.253m-9 0A8.969 8.969 0 0112 11.25c-2.455 0-4.786.89-6.69 2.545M12 13.5a8.969 8.969 0 01-5.618 2.373m0-4.049A8.969 8.969 0 0112 8.75c2.455 0 4.786.89 6.69 2.545m-4.049-3.958A9.957 9.957 0 0112 10.25c-1.393 0-2.732-.303-3.931-.857m4.049 3.958a9.957 9.957 0 01-.11.834m0 0a8.957 8.957 0 00-.819 1.488" />
                </svg>
                Product Management
              </a>
            </li>
            <!-- Orders -->
            <li class="mb-2">
              <a href="#" @click="setCurrentPage('orders')" class="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Orders
              </a>
            </li>
            <!-- Customer Feedback -->
            <li class="mb-2">
              <a href="#" @click="setCurrentPage('customer-feedback')" class="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Customer Feedback
              </a>
            </li>
            <!-- Customer Support -->
            <li class="mb-2">
              <a href="#" @click="setCurrentPage('customer-support')" class="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 0a8.003 8.003 0 00-3.536 0m3.536 0L12 10.5h1.5a2.5 2.5 0 012.5 2.5v1.5a2.5 2.5 0 01-2.5 2.5H12m0-3.5a2.5 2.5 0 00-2.5 2.5V17a2.5 2.5 0 002.5 2.5h1.5a2.5 2.5 0 002.5-2.5v-1.5m0 0a8.003 8.003 0 00-3.536 0m3.536 0L12 10.5h1.5a2.5 2.5 0 012.5 2.5v1.5a2.5 2.5 0 01-2.5 2.5H12" />
                </svg>
                Customer Support
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Logout Button -->
      <div class="mt-8">
        <a href="#" class="flex items-center p-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          LOG OUT
        </a>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navigation -->
      <nav class="bg-white shadow-lg p-4 flex justify-between items-center z-30">
        <div class="flex items-center space-x-6">
          <router-link to="/catalogue">
            <a href="#" class="text-gray-600 hover:text-indigo-500 transition-colors duration-200 font-semibold">PRODUCTS</a>
          </router-link>
          <a href="#" class="text-gray-600 hover:text-indigo-500 transition-colors duration-200 font-semibold">MERCH</a>
          <a href="#" class="text-gray-600 hover:text-indigo-500 transition-colors duration-200 font-semibold">PET TREATS</a>
        </div>
        <div class="relative w-1/3 max-w-sm hidden md:block">
          <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </nav>

      <!-- Main Content and Right Panel -->
      <main class="flex-1 p-8 md:p-12 flex flex-col lg:flex-row gap-8 overflow-y-auto">
        <!-- Center Content -->
        <div class="flex-1">
          <!-- Search Bar for Mobile -->
          <div class="relative w-full mb-8 lg:hidden">
            <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

          <!-- Key Metrics Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <p class="text-sm text-gray-500">INCOME & REVENUE</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ metrics.monthlyRevenue }}</p>
              <a href="#" @click="setCurrentPage('analytics')" class="text-indigo-500 text-sm mt-2 block hover:underline">View more info</a>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
              <p class="text-sm text-gray-500">TOTAL ORDERS</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ metrics.dailyOrders }}</p>
              <a href="#" @click="setCurrentPage('orders')" class="text-indigo-500 text-sm mt-2 block hover:underline">View more info</a>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2 xl:col-span-1">
              <p class="text-sm text-gray-500">ANALYTICS</p>
              <p class="text-xl font-bold text-gray-900 mt-2">Weekly Sales vs. Profit</p>
              <a href="#" @click="setCurrentPage('analytics')" class="text-indigo-500 text-sm mt-2 block hover:underline">Open Analytics page</a>
            </div>
          </div>
          
          <!-- Charts and Tables -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Popular Products Section -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">POPULAR PRODUCTS</h3>
              <ul>
                <li v-for="product in popularProducts" :key="product.id" class="flex items-center space-x-4 mb-4">
                  <img :src="product.image" :alt="product.name" class="w-16 h-16 object-cover rounded-lg">
                  <div>
                    <p class="font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">{{ product.sales }} sales</p>
                  </div>
                </li>
              </ul>
            </div>
            <!-- Latest Orders Section -->
            <div class="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">LATEST ORDERS</h3>
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in latestOrders" :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClasses(order.status)]">{{ order.status }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Side Panel -->
        <aside class="w-full lg:w-80 bg-white rounded-xl shadow-lg p-6 flex-shrink-0">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-800">Profile</h3>
            <a href="#" @click="handleProfileClick" class="text-sm text-indigo-500 hover:underline">View Profile</a>
          </div>
          <!-- Notifications (Placeholder) -->
          <div class="bg-gray-100 rounded-lg p-4 mb-6">
            <h4 class="text-lg font-semibold text-gray-800">Notifications</h4>
            <p class="text-sm text-gray-600 mt-2">No new notifications.</p>
            <!-- Here you would display dynamic notifications -->
          </div>
          <!-- Other Profile Metrics -->
          <div class="mb-6">
            <p class="text-sm text-gray-500">TOTAL USERS</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.totalUsers }}</p>
          </div>
          <div class="mb-6">
            <p class="text-sm text-gray-500">SOCIAL</p>
            <div class="flex items-center space-x-2 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.858.07c1.171.055 1.889.236 2.36.444.605.267.939.623 1.348 1.03.409.409.764.744 1.03 1.349.208.471.389 1.19.444 2.36.058 1.274.07 1.654.07 4.858s-.012 3.584-.07 4.858c-.055 1.171-.236 1.889-.444 2.36-.267.605-.623.939-1.03 1.348-.409.409-.744.764-1.349 1.03-.471.208-1.19.389-2.36.444-1.274.058-1.654.07-4.858.07s-3.584-.012-4.858-.07c-1.171-.055-1.889-.236-2.36-.444-.605-.267-.939-.623-1.348-1.03-.409-.409-.764-.744-1.03-1.349-.208-.471-.389-1.19-.444-2.36-.058-1.274-.07-1.654-.07-4.858s.012-3.584.07-4.858c.055-1.171.236-1.889.444-2.36.267-.605.623-.939 1.03-1.348.409-.409.744-.764 1.349-1.03.471-.208 1.19-.389 2.36-.444 1.274-.058 1.654-.07 4.858-.07zm0-2.163c-3.262 0-3.666.012-4.94.07-1.4.066-2.314.285-3.136.633-.822.348-1.503.744-2.163 1.405-.66.66-1.057 1.341-1.405 2.163-.348.822-.567 1.736-.633 3.136-.058 1.274-.07 1.678-.07 4.94s.012 3.666.07 4.94c.066 1.4.285 2.314.633 3.136.348.822.744 1.503 1.405 2.163.66.66 1.341 1.057 2.163 1.405.822.348 1.736.567 3.136.633 1.274.058 1.678.07 4.94.07s3.666-.012 4.94-.07c1.4-.066 2.314-.285 3.136-.633.822-.348 1.503-.744 2.163-1.405.66-.66 1.057-1.341 1.405-2.163.348-.822.567-1.736.633-3.136.058-1.274.07-1.678.07-4.94s-.012-3.666-.07-4.94c-.066-1.4-.285-2.314-.633-3.136-.348-.822-.744-1.503-1.405-2.163-.66-.66-1.341-1.057-2.163-1.405-.822-.348-1.736-.567-3.136-.633-1.274-.058-1.678-.07-4.94-.07z" />
                <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 9a3 3 0 110 6 3 3 0 010-6zm5.727-4.5c.957 0 1.732.775 1.732 1.732s-.775 1.732-1.732 1.732-1.732-.775-1.732-1.732.775-1.732 1.732-1.732z" />
              </svg>
              <span class="text-gray-900 font-semibold">{{ social.instagramFollowers }} followers</span>
            </div>
            <a :href="social.instagramLink" target="_blank" class="text-indigo-500 text-sm mt-2 block hover:underline">Visit our Instagram</a>
          </div>
          <!-- Sales -->
          <div class="mb-6">
            <p class="text-sm text-gray-500">SALES (WEEKLY)</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.weeklyProfits }}</p>
            <a href="#" @click="setCurrentPage('sales-analysis')" class="text-indigo-500 text-sm mt-2 block hover:underline">View sales analysis</a>
          </div>
          <!-- Latest Orders on right panel -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Latest Orders</h3>
            <ul>
              <li v-for="order in latestOrders" :key="order.id" class="border-b border-gray-200 last:border-b-0 py-2">
                <p class="text-sm font-semibold text-gray-900">#{{ order.id }}</p>
                <p class="text-xs text-gray-600">{{ order.customer }} - {{ order.total }}</p>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

const router = useRouter();
const route = useRoute();

// State management using Vue's ref
const isSidebarOpen = ref(false);
const currentPage = ref('analytics');
const metrics = ref({
  monthlyRevenue: '$0',
  dailyOrders: '0',
  totalUsers: '0',
  weeklyProfits: '$0'
});
const popularProducts = ref([]);
const latestOrders = ref([]);
const social = ref({
  instagramFollowers: '0',
  instagramLink: '#'
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const setCurrentPage = (page) => {
  currentPage.value = page;
  // You would use Vue Router here to navigate
  // router.push({ name: page });
};

// Functions to get Tailwind CSS classes for dynamic styling
const getStatusClasses = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Simulating data fetching from your Node.js backend
const fetchDashboardData = async () => {
  // Replace this with your Pinia store's action that fetches data from Node.js API
  const mockData = {
    metrics: {
      monthlyRevenue: '$15,800',
      dailyOrders: '42',
      totalUsers: '3,245',
      weeklyProfits: '$2,350'
    },
    popularProducts: [
      { id: 1, name: 'Classic Vanilla Cake', image: 'https://placehold.co/64x64/d1d5db/374151?text=C1', sales: 520 },
      { id: 2, name: 'Chocolate Fudge Brownies', image: 'https://placehold.co/64x64/d1d5db/374151?text=C2', sales: 450 },
      { id: 3, name: 'Red Velvet Cupcakes', image: 'https://placehold.co/64x64/d1d5db/374151?text=C3', sales: 380 },
    ],
    latestOrders: [
      { id: '98765', customer: 'John Smith', status: 'Completed', total: '$120.00' },
      { id: '98764', customer: 'Sarah Lee', status: 'Pending', total: '$75.50' },
      { id: '98763', customer: 'Michael Chen', status: 'Cancelled', total: '$210.25' },
    ],
    social: {
      instagramFollowers: '12.5k',
      instagramLink: 'https://www.instagram.com/your-account'
    }
  };

  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  metrics.value = mockData.metrics;
  popularProducts.value = mockData.popularProducts;
  latestOrders.value = mockData.latestOrders;
  social.value = mockData.social;
};

onMounted(() => {
    // Check for the token in localStorage instead of the URL
    const token = localStorage.getItem('adminToken');

    if (!token) {
        // If no token is found, redirect to the login page
        router.push('/sign/admin');
    } else {
        console.log("Token found in localStorage. User is authenticated.");
        fetchDashboardData();
    }
});
</script>

<style scoped>
/*use Tailwind CSS for styling*/
:-webkit-any(.bg-brown-100, .bg-white, .text-pink-600, .text-indigo-500, .text-gray-900) {
  @apply bg-gray-100 text-gray-600 text-indigo-500 text-gray-900;
}
/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
}
/*word in dashboard overview cards */
::-webkit-scrollbar-track {
  background: #f0b89a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #fe44b7;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d78660;
}

</style>

