import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import createPinia
import App from './App.vue';
import router from './router';
//styles
import './assets/index.css';
// import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App); // Create the app instance
//const pinia = createPinia(); // Create the Pinia instance

//app.use(pinia) // Register Pinia with the Vue app
app.use(router) ;// Register the router
app.use(createPinia());
app.mount('#app'); // Mount the app
