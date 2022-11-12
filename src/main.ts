import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'
import router from './router'
import quasarUserOptions from './quasar-user-options'

import {snapcast_service} from "@/services/snapcast_service";

const snap_app = createApp(App);
snap_app.use(Quasar, quasarUserOptions);
snap_app.use(router);
snap_app.provide('snapcast_service', new snapcast_service());
snap_app.mount('#app');

//createApp(App).use(Quasar, quasarUserOptions).use(router).mount('#app')
