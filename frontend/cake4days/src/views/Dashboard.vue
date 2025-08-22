<template>
  <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
    <aside
      :class="{
        'w-64': isSidebarOpen,
        'w-20': !isSidebarOpen,
        'translate-x-0': isSidebarOpen,
        '-translate-x-full': !isSidebarOpen,
      }"
      class="transform transition-width duration-300 ease-in-out md:translate-x-0 md:flex md:flex-col bg-[#D2B48C] shadow-xl flex-col p-4 fixed h-full md:relative z-40"
    >
      <div
        class="flex items-center space-x-2 mb-8"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-start': isSidebarOpen }"
      >
        <span class="text-2xl font-bold text-gray-800" v-show="isSidebarOpen"
          >CAKE 4 DAYS</span
        >
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :aria-expanded="isSidebarOpen"
          aria-controls="main-sidebar"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <nav class="flex-1" id="main-sidebar">
        <ul>
          <li class="mb-2">
            <a
              href="#"
              @click.prevent="setCurrentPage('analytics')"
              :class="{
                'bg-white text-gray-900 shadow-md': currentPage === 'analytics',
                'text-gray-600 hover:bg-gray-100': currentPage !== 'analytics',
              }"
              class="flex items-center p-3 rounded-xl transition-colors duration-200"
              aria-current="page"
            >
              <span v-show="isSidebarOpen">ANALYTICS</span>
            </a>
          </li>
          <li class="mb-2">
            <a
              href="#"
              @click.prevent="setCurrentPage('product-management')"
              :class="{
                'bg-white text-gray-900 shadow-md':
                  currentPage === 'product-management',
                'text-gray-600 hover:bg-gray-100':
                  currentPage !== 'product-management',
              }"
              class="flex items-center p-3 rounded-xl transition-colors duration-200"
            >
              <span v-show="isSidebarOpen">PRODUCT MANAGEMENT</span>
            </a>
          </li>
          <li class="mb-2">
            <a
              href="#"
              @click.prevent="setCurrentPage('orders')"
              :class="{
                'bg-white text-gray-900 shadow-md': currentPage === 'orders',
                'text-gray-600 hover:bg-gray-100': currentPage !== 'orders',
              }"
              class="flex items-center p-3 rounded-xl transition-colors duration-200"
            >
              <span v-show="isSidebarOpen">ORDERS</span>
            </a>
          </li>
          <li class="mb-2">
            <a
              href="#"
              @click.prevent="setCurrentPage('customer-feedback')"
              :class="{
                'bg-white text-gray-900 shadow-md':
                  currentPage === 'customer-feedback',
                'text-gray-600 hover:bg-gray-100':
                  currentPage !== 'customer-feedback',
              }"
              class="flex items-center p-3 rounded-xl transition-colors duration-200"
            >
              <span v-show="isSidebarOpen">CUSTOMER FEEDBACK</span>
            </a>
          </li>
          <li class="mb-2">
            <a
              href="#"
              @click.prevent="setCurrentPage('customer-support')"
              :class="{
                'bg-white text-gray-900 shadow-md':
                  currentPage === 'customer-support',
                'text-gray-600 hover:bg-gray-100':
                  currentPage !== 'customer-support',
              }"
              class="flex items-center p-3 rounded-xl transition-colors duration-200"
            >
              <span v-show="isSidebarOpen">CUSTOMER SUPPORT</span>
            (
            </a>
          </li>
        </ul>
      </nav>
      <div class="mt-8">
        <a
          href="#"
          @click.prevent="logout"
          class="flex items-center p-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
        >
          <span v-show="isSidebarOpen">LOG OUT</span>
        </a>
      </div>
    </aside>

    <div class="flex-1 flex flex-col p-8 md:p-12">
      <div class="relative w-full mb-8 flex items-center gap-4">
        <input
          type="text"
          placeholder="SEARCHBAR"
          class="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          @click="isProfileModalOpen = true"
          class="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Open profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A12 12 0 0112 15c2.474 0 4.793.684 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <main class="flex-1">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <p class="text-lg font-semibold text-gray-900">TOTAL REVENUE:</p>
            <p class="text-4xl font-bold text-gray-900 mt-2">
              {{ metrics.monthlyRevenue }}
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <p class="text-lg font-semibold text-gray-900">DAILY ORDERS:</p>
            <p class="text-4xl font-bold text-gray-900 mt-2">
              {{ metrics.dailyOrders }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              INCOME AND EXPENSE SUMMARY
            </h3>
            <p class="text-sm text-gray-500">Analytics details here...</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              PRODUCT MANAGEMENT
            </h3>
            <p class="text-sm text-gray-500">Management tools here...</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              LATEST ORDERS
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in latestOrders" :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ order.id }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ order.customer }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          getStatusClasses(order.status),
                        ]"
                        >{{ order.status }}</span
                      >
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ order.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              POPULAR PRODUCTS
            </h3>
            <ul>
              <li
                v-for="product in popularProducts"
                :key="product.id"
                class="flex items-center space-x-4 mb-4"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p class="font-semibold text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">{{ product.sales }} sales</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <transition name="slide-fade">
      <div v-if="isProfileModalOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div
          class="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
          @click="isProfileModalOpen = false"
        ></div>
        <div
          class="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          :class="{
            'translate-x-0': isProfileModalOpen,
            'translate-x-full': !isProfileModalOpen,
          }"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">PROFILE</h3>
              <button
                @click="isProfileModalOpen = false"
                class="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800">TOTAL USERS</h3>
              <p class="text-2xl font-bold text-gray-900">
                {{ metrics.totalUsers }}
              </p>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800">SOCIAL</h3>
              <div class="flex items-center space-x-2 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.858.07c1.171.055 1.889.236 2.36.444.605.267.939.623 1.348 1.03.409.409.764.744 1.03 1.349.208.471.389 1.19.444 2.36.058 1.274.07 1.654.07 4.858s-.012 3.584-.07 4.858c-.055 1.171-.236 1.889-.444 2.36-.267.605-.623.939-1.03 1.348-.409.409-.744.764-1.349 1.03-.471.208-1.19.389-2.36.444-1.274.058-1.654.07-4.858.07s-3.584-.012-4.858-.07c-1.171-.055-1.889-.236-2.36-.444-.605-.267-.939-.623-1.348-1.03-.409-.409-.764-.744-1.349-1.03-.208-.471-.389-1.19-.444-2.36-.058-1.274-.07-1.654-.07-4.858s.012-3.584.07-4.858c.055-1.171.236-1.889.444-2.36.267-.605.623-.939 1.03-1.348.409-.409.744-.764 1.349-1.03.471-.208 1.19-.389 2.36-.444 1.274-.058 1.654-.07 4.858-.07zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 9a3 3 0 110 6 3 3 0 010-6zm5.727-4.5c.957 0 1.732.775 1.732 1.732s-.775 1.732-1.732 1.732-1.732-.775-1.732-1.732.775-1.732 1.732-1.732z"
                  />
                </svg>
                <span class="text-gray-900 font-semibold"
                  >{{ social.instagramFollowers }} followers</span
                >
              </div>
              <a
                :href="social.instagramLink"
                target="_blank"
                class="text-gray-600 text-sm mt-2 block hover:underline"
                >Visit our Instagram</a
              >
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800">SALES (WEEKLY)</h3>
              <p class="text-2xl font-bold text-gray-900">
                {{ metrics.weeklyProfits }}
              </p>
              <a
                href="#"
                @click.prevent="setCurrentPage('sales-analysis')"
                class="text-gray-600 text-sm mt-2 block hover:underline"
                >View sales analysis</a
              >
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800">CUSTOM ORDERS</h3>
              <p class="text-2xl font-bold text-gray-900">
                {{ metrics.customOrders }}
              </p>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800">LATEST ORDERS</h3>
              <ul>
                <li
                  v-for="order in latestOrders.slice(0, 3)"
                  :key="order.id"
                  class="border-b border-gray-200 last:border-b-0 py-2"
                >
                  <p class="text-sm font-semibold text-gray-900">
                    #{{ order.id }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ order.customer }} - {{ order.total }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isSidebarOpen = ref(true);
const isProfileModalOpen = ref(false);
const currentPage = ref('analytics');
const metrics = ref({
  monthlyRevenue: '$0',
  dailyOrders: '0',
  totalUsers: '0',
  weeklyProfits: '$0',
  customOrders: '0',
});
const popularProducts = ref([]);
const latestOrders = ref([]);
const social = ref({
  instagramFollowers: '0',
  instagramLink: '#',
});

const checkScreenSize = () => {
  isSidebarOpen.value = window.innerWidth >= 768;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const setCurrentPage = (page) => {
  currentPage.value = page;
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const fetchDashboardData = async () => {
  try {
    const mockData = {
      metrics: {
        monthlyRevenue: '$15,800',
        dailyOrders: '42',
        totalUsers: '3,245',
        weeklyProfits: '$2,350',
        customOrders: '15',
      },
      popularProducts: [
        {
          id: 1,
          name: 'Classic Vanilla Cake',
          image: 'https://placehold.co/64x64/d1d5db/374151?text=C1',
          sales: 520,
        },
        {
          id: 2,
          name: 'Chocolate Fudge Brownies',
          image: 'https://placehold.co/64x64/d1d5db/374151?text=C2',
          sales: 450,
        },
        {
          id: 3,
          name: 'Red Velvet Cupcakes',
          image: 'https://placehold.co/64x64/d1d5db/374151?text=C3',
          sales: 380,
        },
      ],
      latestOrders: [
        { id: '98765', customer: 'John Smith', status: 'Completed', total: '$120.00' },
        { id: '98764', customer: 'Sarah Lee', status: 'Pending', total: '$75.50' },
        {
          id: '98763',
          customer: 'Michael Chen',
          status: 'Cancelled',
          total: '$210.25',
        },
        { id: '98762', customer: 'Emily Jones', status: 'Completed', total: '$55.00' },
        {
          id: '98761',
          customer: 'David Kim',
          status: 'Completed',
          total: '$90.75',
        },
      ],
      social: {
        instagramFollowers: '12.5k',
        instagramLink: 'https://www.instagram.com/your-account',
      },
    };
    await new Promise((resolve) => setTimeout(resolve, 500));
    metrics.value = mockData.metrics;
    popularProducts.value = mockData.popularProducts;
    latestOrders.value = mockData.latestOrders;
    social.value = mockData.social;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  const token = localStorage.getItem('adminToken');
  if (!token) {
    // You can uncomment this line when your router is set up
    // router.push('/sign/admin');
    console.warn(
      'No authentication token found. Redirecting to login route is skipped in this example.'
    );
  } else {
    fetchDashboardData();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const logout = () => {
  localStorage.removeItem('adminToken');
  router.push('/sign/admin');
};
</script>

<style scoped>
.transition-width {
  transition-property: width, transform;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>