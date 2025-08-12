import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'; // Import the Vuex store
import './assets/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App) // Create the app instance

app.use(store) // Register the Vuex store with the Vue app
app.use(router) // Register the router

app.mount('#app') // Mount the app
