import { createStore } from 'vuex'
import axios from 'axios'

// Set a base URL for all API requests to make them cleaner
axios.defaults.baseURL = 'http://localhost:9090'; 
// Set this header so cookies are sent with every request
axios.defaults.withCredentials = true;

export default createStore({
  state: {
    user: null, 
    isAuthenticated: false, 
    isAdmin: false, 
  },
  getters: {
    currentUser: (state) => state.user,
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
        console.log('Login successful:', response.data.message);
        await this.dispatch('checkAuth');
        return true; 
      } catch (e) {
        console.error('Login failed:', e.response?.data?.message || e.message);
        throw e;
      }
    },
    
    async loginAdmin({ commit }, credentials) {
      try {
        const response = await axios.post('/auth/login/admin', credentials);
        console.log('Admin login successful:', response.data.message);
        await this.dispatch('checkAuth');
        return true;
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
  },
  modules: {}
})
