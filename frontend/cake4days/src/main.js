import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import { createPinia } from 'pinia'; // Import createPinia

// styles
import './assets/index.css';
// import '@fortawesome/fontawesome-free/css/all.css';

// Create the main Vue app instance
const app = createApp(App);

// Create the Pinia store instance
const pinia = createPinia();

// Register the necessary plugins with the app
app.use(store); // Vuex store
app.use(pinia); // Pinia store
app.use(router); // Vue Router

// Mount the app to the DOM
app.mount('#app');