import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';
// CHANGE: Add the following import
import { defineCustomElements } from '@ionic/pwa-elements/loader';

/* ...existing Ionic styles... */

/* Theme variables */
import './theme/variables.css';

// CHANGE: Call the element loader before the createApp() call
defineCustomElements(window);

const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
  app.mount('#app');
});
