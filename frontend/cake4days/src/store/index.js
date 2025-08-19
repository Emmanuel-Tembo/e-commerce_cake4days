import { createStore } from 'vuex';
import axios from 'axios';

// Set a base URL for all API requests to make them cleaner
axios.defaults.baseURL = 'http://localhost:9090'; 
// Set this header so cookies are sent with every request
axios.defaults.withCredentials = true;

export default createStore({
  state: {
    user: null, 
    isAuthenticated: false, 
    isAdmin: false,
    products: [],
    searchTerm: '', 
    petProducts: [],
    humanProducts: [],
    podProducts: [],
  },
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: state => !!state.token, // checks if a token exists
  },
  mutations: {
    setAuth(state, userPayload) {
      state.user = userPayload;
      state.isAuthenticated = true;
      state.isAdmin = userPayload.role === 'admin';
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
    // ADDED: New mutation to set the products in the state
    setProducts(state, productsPayload) {
      state.products = productsPayload;
    },
    // NEW: Mutation to set the search term
    setSearchTerm(state, term) {
      state.searchTerm = term;
    },
    // NEW: Mutation to clear the search term
    clearSearchTerm(state) {
        state.searchTerm = '';
    },
  },
  actions: {
    // NEW ACTION to handle user registration
    async register({ commit }, credentials) {
      try {
        const response = await axios.post('/auth/register', credentials);
        console.log('Registration successful:', response.data.message);
        // After successful registration, you might want to automatically log the user in
        // or redirect them to the login page.
        // For now, we'll just return true.
        return true; 
      } catch (e) {
        console.error('Registration failed:', e.response?.data?.message || e.message);
        throw e;
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/auth/login', credentials);
        commit('setAuth', response.data.user);
        return response.data.user;
      } catch (e) {
        console.error('Login failed:', e.response?.data?.message || e.message);
        throw e;
      }
    },

    async loginAdmin({ commit }, credentials) {
    try {
      const response = await axios.post('/auth/login/admin', credentials);
      
      // The backend returns a complete user object on admin login
      // so we can use the same setAuth mutation
      commit('setAuth', response.data.user); 
      
      return response.data.user;
    } catch (e) {
      console.error('Admin login failed:', e.response?.data?.message || e.message);
      throw e;
    }
  },

    async logout({ commit }) {
      try {
        await axios.post('/auth/logout');
        commit('clearAuth');
      } catch (e) {
        console.error('Logout failed:', e);
        commit('clearAuth');
      }
    },

    async checkAuth({ commit }) {
      try {
        const response = await axios.get('/auth/protected');
        const user = response.data.user;
        if (user) {
          commit('setAuth', user);
          return user;
        }
      } catch (e) {
        console.log('User not authenticated:', e.response?.data?.message || 'Token is invalid or expired.');
        commit('clearAuth');
      }
      return null;
    },
    // NEW ACTION to request a password reset email
    async forgotPassword({ commit }, email) {
      try {
        const response = await axios.post('/auth/forgot-password', { email });
        return response.data.message;
      } catch (e) {
        console.error('Forgot password request failed:', e.response?.data?.message || e.message);
        throw e;
      }
    },
    
    // UPDATED ACTION to send the new password and token in the request body
    async resetPassword({ commit }, payload) {
      // The payload now contains the token and newPassword
      const { token, newPassword } = payload;
      try {
        const response = await axios.post(`/auth/reset-password`, { token, newPassword });
        return response.data.message;
      } catch (e) {
        console.error('Password reset failed:', e.response?.data?.message || e.message);
        throw e;
      }
    },

    // ADDED: New action to fetch products from the backend and fix the data type
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get('/products/getAll');
        // Assuming your backend returns an array of products in a 'results' property
        const products = response.data.data.map(product => ({
          ...product,
          price: parseFloat(product.price) // CONVERTING PRICE TO A NUMBER
        }));
        
        commit('setProducts', products);
      } catch (error) {
        console.error('Error fetching products:', error);
        // You can commit an empty array or handle the error state here
        commit('setProducts', []);
      }
    },
  },
});
